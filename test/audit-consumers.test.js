const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { resolve, join } = require('node:path');

/**
 * Tests del AUDITOR, no del contrato.
 *
 * Los tres gates cross-repo son las únicas herramientas que cruzan la costura entre
 * los 3 repos, y hasta ahora nada verificaba que vieran lo que dicen medir. Se
 * ejercitan contra repos SINTÉTICOS por las costuras `MEMIVO_AUDIT_API_SRC` /
 * `MEMIVO_AUDIT_CLIENT_SRC`: sin eso, la única forma de probar que el auditor detecta
 * un duplicado sería tener el duplicado de verdad en un consumidor.
 */
const auditor = resolve(__dirname, '..', 'scripts', 'audit-consumers.js');

function runAudit({ api = '', client = '' }) {
  const workspace = mkdtempSync(join(tmpdir(), 'memivo-audit-'));
  const apiSrc = join(workspace, 'api');
  const clientSrc = join(workspace, 'client');
  mkdirSync(apiSrc, { recursive: true });
  mkdirSync(clientSrc, { recursive: true });
  if (api) writeFileSync(join(apiSrc, 'fixture.ts'), api, 'utf8');
  if (client) writeFileSync(join(clientSrc, 'fixture.ts'), client, 'utf8');

  // El auditor mide la cobertura de traducciones de los 192 códigos de error contra
  // los 3 locales del cliente, así que un cliente sintético tiene que parecer un
  // cliente. Van vacíos a propósito: acá no se está midiendo cobertura de i18n.
  const locales = join(clientSrc, 'i18n', 'locales');
  mkdirSync(locales, { recursive: true });
  for (const locale of ['en', 'es', 'pt']) {
    writeFileSync(join(locales, `${locale}.ts`), 'export default { errors: {} };\n', 'utf8');
  }

  try {
    // El auditor sale 1 cuando encuentra algo, que en varios de estos casos es
    // justamente lo que se está afirmando: se lee el stdout, no el exit code.
    let stdout;
    try {
      stdout = execFileSync(process.execPath, [auditor, '--verbose'], {
        env: {
          ...process.env,
          MEMIVO_AUDIT_API_SRC: apiSrc,
          MEMIVO_AUDIT_CLIENT_SRC: clientSrc,
        },
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch (error) {
      stdout = error.stdout;
    }
    return JSON.parse(stdout);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

test('un regex del contrato copiado DENTRO de un decorador se detecta como duplicado', () => {
  // El defecto que cierra: `declarations()` sólo recorría `source.statements`, o sea el
  // nivel superior del archivo. Un patrón copiado en el argumento de un decorador
  // nunca entraba al corpus y por lo tanto NO PODÍA formar par con el símbolo del
  // paquete, así que `crossRepoRisks` no lo veía jamás. Tres copias byte a byte
  // vivieron así en el api con el gate en verde.
  const report = runAudit({
    api: [
      "import { Matches } from 'class-validator';",
      'export class FixtureDto {',
      '  @Matches(/^\\+[1-9]\\d{6,14}$/)',
      '  phone: string;',
      '}',
      '',
    ].join('\n'),
  });

  const hit = report.crossRepo.risks.find(
    (risk) => risk.right.name === 'INTERNATIONAL_PHONE_REGEX',
  );
  assert.ok(hit, 'el regex del decorador tiene que aparecer en crossRepoRisks');
  assert.equal(hit.sameSignature, true);
  assert.equal(hit.left.side, 'api');
});

test('un regex del contrato copiado dentro de un CUERPO DE FUNCIÓN se detecta', () => {
  const report = runAudit({
    api: [
      'export function validate(email: string): boolean {',
      '  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
      '  return emailRegex.test(email);',
      '}',
      '',
    ].join('\n'),
  });

  const hit = report.crossRepo.risks.find((risk) => risk.right.name === 'EMAIL_REGEX');
  assert.ok(hit, 'el regex del cuerpo de función tiene que aparecer en crossRepoRisks');
  assert.equal(hit.left.name, 'emailRegex');
});

test('importar el contrato en vez de copiarlo NO produce riesgo', () => {
  const report = runAudit({
    api: [
      "import { Matches } from 'class-validator';",
      "import { INTERNATIONAL_PHONE_REGEX } from '@memivo/contracts/validation';",
      'export class FixtureDto {',
      '  @Matches(INTERNATIONAL_PHONE_REGEX)',
      '  phone: string;',
      '}',
      '',
    ].join('\n'),
  });

  assert.deepEqual(
    report.crossRepo.risks.filter((risk) => risk.left.side === 'api'),
    [],
  );
});

test('dos regex triviales iguales entre api y cliente NO forman par', () => {
  // Acotación deliberada: el defecto que se persigue es «un consumidor reimplementó un
  // patrón que ya vive en el contrato». Que el api y el cliente escriban los dos
  // `/\s+/g` no es un contrato compartido. Sin este corte el reporte pasaba de 4
  // hallazgos reales a 1174.
  const report = runAudit({
    api: ['export const x = String(/\\s+/g);', ''].join('\n'),
    client: ['export const y = String(/\\s+/g);', ''].join('\n'),
  });

  const consumerToConsumer = report.crossRepo.risks.filter(
    (risk) => risk.left.side !== 'package' && risk.right.side !== 'package',
  );
  assert.deepEqual(consumerToConsumer, []);
});

test('una frontera intencional que ya no matchea nada sale listada en resolvedBoundaries', () => {
  // Con consumidores vacíos NINGUNA entrada del mapa puede formar par, así que todas
  // tienen que aparecer como caducadas. El defecto que cierra: la clave es
  // `${kind}:${name}`, sin lado ni firma, así que una entrada que dejó de matchear
  // sigue excusando cualquier declaración FUTURA con ese nombre — es una excusa en
  // blanco, y era invisible.
  const report = runAudit({});

  assert.ok(
    report.crossRepo.resolvedBoundaries.length > 0,
    'con consumidores vacíos todas las fronteras tienen que salir como caducadas',
  );
  assert.equal(report.summary.resolvedBoundaries, report.crossRepo.resolvedBoundaries.length);
});

test('el tipo ErrorCode del paquete entra al corpus del auditor', () => {
  // `ErrorCode`, `ErrorCodeValue` y el `const ErrorCode` vivían declarados en
  // `errors/index.ts`, y los dos auditores saltean los `index.ts` a propósito. Eso
  // dejaba a `ErrorCodeValue` —superficie pública que el cliente consume— fuera del
  // corpus de duplicados Y del de exports. Este test falla si alguien los devuelve al
  // barrel.
  const report = runAudit({
    api: [
      "import type { ErrorCode } from '@memivo/contracts/errors';",
      'export type Local = (typeof ErrorCode)[keyof typeof ErrorCode];',
      '',
    ].join('\n'),
  });

  const declaredNames = new Set(
    [...report.crossRepo.risks, ...report.crossRepo.intentional].map((pair) => pair.right.name),
  );
  // El fixture importa el contrato, así que no debe haber riesgo; lo que se afirma es
  // que el auditor PUEDE ver el símbolo, cosa que se comprueba con el corpus del
  // paquete a través de una copia literal.
  assert.equal(declaredNames.has('ErrorCode') && report.crossRepo.risks.length > 0, false);

  const copied = runAudit({
    api: [
      'declare const ErrorCode: Record<string, string>;',
      'export type Local = (typeof ErrorCode)[keyof typeof ErrorCode];',
      '',
    ].join('\n'),
  });
  assert.ok(
    copied.crossRepo.risks.some((risk) => risk.right.name === 'ErrorCode'),
    'redeclarar el tipo ErrorCode tiene que dar riesgo ahora que no vive en el barrel',
  );
});
