/**
 * Auditor: campos de respuesta que el API produce, paga y NADIE lee.
 *
 * Por qué existe. Diez de las diecisiete fichas del bloque 41 terminan pidiendo
 * exactamente esto, con estas palabras: «extender el auditor de contratos para
 * que, por cada campo de una response interface, exija al menos un lector en
 * memivo_client». Los dos auditores que ya había miden IDENTIDAD DE SÍMBOLOS
 * —que un tipo no esté duplicado, que el transporte use el símbolo compartido—
 * y ninguno mira adentro de la interfaz. Por eso 17 campos muertos convivían
 * con `npm run quality` en verde en los tres repos.
 *
 * Y no es sólo bytes: el campo muerto se PAGA. `GET /album/:id/guests` hacía un
 * LEFT JOIN a los roles de plataforma de cada participante para mandar un dato
 * que además es PII; `POST /auth/2fa/generate` renderizaba un PNG data-URI de
 * 4,3 KB que el cliente descarta porque pinta el QR él mismo.
 *
 * Cómo mide. Por cada propiedad de una interface o type de respuesta
 * (`*Response`, `*Payload`, `*Result`, `*Entry`, `*ListItem`), busca el nombre
 * como identificador en `memivo_client/src`. **El selector es permisivo a
 * propósito**: alcanza con que el nombre aparezca escrito. Un falso negativo
 * deja un campo muerto un tiempo más; un falso positivo hace que alguien borre
 * un campo que la app SÍ lee, y eso es una pantalla rota. Los campos que se
 * leen por spread o por acceso dinámico son justamente los que un selector
 * estricto no puede ver.
 *
 * ⚠️ TODAVÍA NO ESTÁ ENCADENADO EN `npm run quality`, y el motivo importa: hoy
 * reporta 21 campos reales y un gate que arranca en rojo obliga a apagarlo, que
 * es la excusa en blanco que estos gates existen para no repartir. Se enciende
 * cuando el bloque 41 termine de borrarlos —la regla y la migración de los
 * sitios son UN solo trabajo—; el inventario ya medido está en
 * `RESOLUCION-PROGRESO.md`, bloque 41.
 *
 * Uso: node scripts/audit-response-fields.js [--verbose]
 */
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const packageSrc = resolve(packageRoot, 'src');

const clientSrc = process.env.MEMIVO_AUDIT_CLIENT_SRC
  ? resolve(process.env.MEMIVO_AUDIT_CLIENT_SRC)
  : resolve(workspaceRoot, 'memivo_client', 'src');

const verbose = process.argv.includes('--verbose');

/**
 * Los sufijos que marcan un tipo que VIAJA de vuelta al cliente. No se auditan
 * los `*Request`: sus campos los lee el API, no la app.
 */
const RESPONSE_SUFFIXES = [
  'Response',
  'Payload',
  'Result',
  'Entry',
  'ListItem',
  'Summary',
  'Stats',
];

/**
 * Campos que se declaran a propósito sin lector en el cliente. Cada uno dice
 * POR QUÉ: sin el motivo, la excusa es una excusa en blanco y el auditor deja
 * de servir.
 */
const INTENTIONAL_WITHOUT_READER = new Map([
  [
    'UploadIntentFileSignature.uploadIntentFileId',
    'lo devuelve el finalize del server contra sí mismo; el cliente sólo lo reenvía',
  ],
]);

const collectFiles = (directory, extensions) => {
  const found = [];
  if (!existsSync(directory)) return found;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectFiles(target, extensions));
    } else if (extensions.some((extension) => target.endsWith(extension))) {
      found.push(target);
    }
  }

  return found;
};

// --- Lo que el cliente escribe --------------------------------------------
const clientText = collectFiles(clientSrc, ['.ts', '.tsx'])
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

const clientReads = (field) =>
  new RegExp(`\\b${field}\\b`).test(clientText);

// --- Los campos que los contratos declaran como respuesta ------------------
const orphans = [];
let audited = 0;

for (const file of collectFiles(packageSrc, ['.ts'])) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );

  const visit = (node) => {
    const isResponseShape =
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      RESPONSE_SUFFIXES.some((suffix) => node.name.text.endsWith(suffix));

    if (isResponseShape) {
      const members = ts.isInterfaceDeclaration(node)
        ? node.members
        : ts.isTypeLiteralNode(node.type)
          ? node.type.members
          : [];

      for (const member of members) {
        if (!ts.isPropertySignature(member) || !member.name) continue;
        const field = member.name.getText(source);
        const qualified = `${node.name.text}.${field}`;
        audited += 1;

        if (INTENTIONAL_WITHOUT_READER.has(qualified)) continue;
        if (clientReads(field)) continue;

        orphans.push({
          qualified,
          where: `${relative(packageRoot, file)}:${
            source.getLineAndCharacterOfPosition(member.getStart(source)).line + 1
          }`,
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
}

// --- Las excusas tienen que ganarse el lugar en cada corrida ---------------
const staleExcuses = [...INTENTIONAL_WITHOUT_READER.keys()].filter((qualified) => {
  const field = qualified.split('.')[1];
  return clientReads(field);
});

if (verbose) {
  for (const orphan of orphans) {
    process.stdout.write(`  · ${orphan.qualified} (${orphan.where})\n`);
  }
}

if (staleExcuses.length > 0) {
  process.stderr.write(
    '\nExcusas de INTENTIONAL_WITHOUT_READER que ya no aplican (el cliente SÍ lee el campo):\n',
  );
  for (const excuse of staleExcuses) process.stderr.write(`  ✗ ${excuse}\n`);
  process.exit(1);
}

if (orphans.length > 0) {
  process.stderr.write(
    `\nCampos de respuesta que ningún archivo de memivo_client/src lee (${orphans.length}):\n`,
  );
  for (const orphan of orphans) {
    process.stderr.write(`  ✗ ${orphan.qualified} — ${orphan.where}\n`);
  }
  process.stderr.write(
    '\nBorralos del contrato y de su productor, o declaralos en\n' +
      'INTENTIONAL_WITHOUT_READER con el motivo.\n',
  );
  process.exit(1);
}

process.stdout.write(
  `audit:response-fields: ${audited} campos de respuesta, todos con lector.\n`,
);
