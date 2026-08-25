const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, resolve, join } = require('node:path');

/**
 * TESTS DEL AUDITOR DE ENDPOINTS, NO DE LAS RUTAS.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `audit-endpoints.js` era el único de los auditores cross-repo sin una sola
 * prueba, y su docblock declaraba un hueco con nombre y consecuencia: NO
 * comparaba el método, así que un `GET /x` del api quedaba avalado por un
 * `POST /x` del cliente. Cerrar ese hueco sin probarlo habría cambiado un
 * falso negativo declarado por uno silencioso: sobre el árbol real la
 * comparación de verbo da CERO desvíos, y cero es exactamente lo que se ve
 * cuando el reconocedor dejó de enganchar. Un auditor cuyo detector nuevo no
 * tiene un caso que lo ponga rojo está apagado, no limpio.
 *
 * ── CÓMO SE PRUEBA ────────────────────────────────────────────────────────
 * Contra repos SINTÉTICOS, por las mismas costuras que ya usa el test del
 * auditor de consumidores: `MEMIVO_AUDIT_API_SRC`, `MEMIVO_AUDIT_CLIENT_SRC` y
 * `MEMIVO_AUDIT_MODERATION_README`. Sin eso, la única forma de probar que
 * detecta un verbo cruzado sería tener el verbo cruzado de verdad en el api.
 *
 * ── LO QUE NO MIDE, DICHO ─────────────────────────────────────────────────
 * No mide el matcheo por concatenación ni el chequeo del manual de moderación:
 * de esos no se tocó nada en esta ola, y un caso escrito de apuro alrededor de
 * código que no cambió da la ilusión de cobertura sin agregar una medición.
 */
const auditor = resolve(__dirname, '..', 'scripts', 'audit-endpoints.js');

/** Corre el auditor sobre dos árboles sintéticos y devuelve su reporte. */
function runAudit({ apiFiles = {}, clientFiles = {}, moderationReadme = '' }) {
  const workspace = mkdtempSync(join(tmpdir(), 'memivo-endpoints-'));
  const apiSrc = join(workspace, 'api');
  const clientSrc = join(workspace, 'client');
  const readme = join(workspace, 'MODERATION.md');
  mkdirSync(apiSrc, { recursive: true });
  mkdirSync(clientSrc, { recursive: true });
  writeFileSync(readme, moderationReadme, 'utf8');

  for (const [root, files] of [
    [apiSrc, apiFiles],
    [clientSrc, clientFiles],
  ]) {
    for (const [name, contents] of Object.entries(files)) {
      const target = join(root, name);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, contents, 'utf8');
    }
  }

  try {
    // El EXIT CODE no alcanza como oráculo y por eso se lee el mensaje: sobre un
    // api sintético la lista real de huérfanos legítimos queda sin respaldo, así
    // que el auditor sale 1 por `staleExcuses` en TODOS estos casos, incluidos
    // los que afirman que no encontró ningún desvío. Lo que separa un caso del
    // otro es qué rama habló.
    const run = spawnSync(process.execPath, [auditor, '--verbose'], {
      env: {
        ...process.env,
        MEMIVO_AUDIT_API_SRC: apiSrc,
        MEMIVO_AUDIT_CLIENT_SRC: clientSrc,
        MEMIVO_AUDIT_MODERATION_README: readme,
      },
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const stdout = run.stdout ?? '';
    const start = stdout.indexOf('{');
    const end = stdout.lastIndexOf('}');
    assert.ok(start >= 0 && end > start, `sin reporte JSON:\n${stdout}`);
    return {
      report: JSON.parse(stdout.slice(start, end + 1)),
      stderr: run.stderr ?? '',
    };
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

/** Lo que imprime la rama del verbo cruzado, y sólo ella. */
const MENSAJE_DEL_DESVIO = /sólo toca con OTRO verbo/;

const CONTROLLER = `
  @Controller('widgets')
  export class WidgetController {
    @Get(':id')
    findOne() {}
  }
`;

test('el verbo cruzado se reporta: un GET avalado sólo por un POST ya no pasa', () => {
  const { report, stderr } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: {
      'widget.service.ts': 'export const save = (id) => api.post(`/widgets/${id}`, {});',
    },
  });

  assert.equal(report.orphans.length, 0, 'no es un huérfano: el path se toca');
  assert.deepEqual(report.methodMismatches.length, 1);
  assert.match(report.methodMismatches[0], /GET \/widgets\/:id/);
  assert.match(report.methodMismatches[0], /con POST/);
  assert.match(stderr, MENSAJE_DEL_DESVIO);
});

test('el verbo que coincide avala, y el auditor queda en verde', () => {
  const { report, stderr } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: {
      'widget.service.ts': 'export const read = (id) => api.get(`/widgets/${id}`);',
    },
  });

  assert.deepEqual(report.methodMismatches, []);
  assert.deepEqual(report.orphans, []);
  assert.doesNotMatch(stderr, MENSAJE_DEL_DESVIO);
});

test('un literal SUELTO sigue avalando cualquier verbo: la asimetría no se rompió', () => {
  // Es la mitad conservadora del ensanche. El cliente arma urls en constantes y
  // las pasa por variable; ahí el verbo no está al lado, y suponerlo haría que
  // el auditor mande a borrar una ruta viva — el único error que este archivo
  // no puede cometer.
  const { report, stderr } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: {
      'widget.routes.ts': 'export const WIDGET = `/widgets/${id}`;',
    },
  });

  assert.deepEqual(report.methodMismatches, []);
  assert.deepEqual(report.orphans, []);
  assert.doesNotMatch(stderr, MENSAJE_DEL_DESVIO);
});

test('el mismo esqueleto anclado en un lado y suelto en el otro NO se compara por verbo', () => {
  // La regla de composición, escrita como caso: basta una aparición sin verbo
  // para que el esqueleto vuelva a avalar cualquiera. Sin esto, un helper que
  // guarda el path en una constante y otro archivo que lo llama con otro verbo
  // producirían un desvío inventado.
  const { report, stderr } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: {
      'widget.service.ts': 'export const save = (id) => api.post(`/widgets/${id}`, {});',
      'widget.routes.ts': 'export const WIDGET = `/widgets/${id}`;',
    },
  });

  assert.deepEqual(report.methodMismatches, []);
  assert.deepEqual(report.orphans, []);
  assert.doesNotMatch(stderr, MENSAJE_DEL_DESVIO);
});

test('el reconocedor de verbo sigue viendo: el reporte cuenta los esqueletos que sí midió', () => {
  // El ancla anti-ceguera. «Cero desvíos» y «el reconocedor no enganchó nada»
  // se ven idénticos desde afuera; este número los separa.
  const { report } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: {
      'widget.service.ts': 'export const read = (id) => api.get(`/widgets/${id}`);',
    },
  });

  assert.equal(report.clientCallSkeletonsWithKnownMethod, 1);
});

test('la ruta sin ningún llamador sigue siendo huérfana, no un desvío de verbo', () => {
  const { report, stderr } = runAudit({
    apiFiles: { 'widget.controller.ts': CONTROLLER },
    clientFiles: { 'nada.ts': 'export const nada = 1;' },
  });

  assert.deepEqual(report.methodMismatches, []);
  assert.equal(report.orphans.length, 1);
  assert.match(report.orphans[0], /GET \/widgets\/:id/);
  // Y habla la rama vieja, no la nueva: los dos hallazgos se cuentan aparte
  // porque no se arreglan igual.
  assert.doesNotMatch(stderr, MENSAJE_DEL_DESVIO);
  assert.match(stderr, /sin consumidor en el cliente/);
});
