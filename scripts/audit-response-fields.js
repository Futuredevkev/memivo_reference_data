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
 * ── QUÉ SE AUDITA ──────────────────────────────────────────────────────────
 *
 * El universo se siembra por CONDUCTA —lo que un handler HTTP o un
 * `@SubscribeMessage` declara devolver— **más** la red secundaria de sufijos,
 * y desde ahí todo lo que se alcance transitivamente. Un campo no es menos
 * muerto por viajar anidado, y la forma anidada es justamente donde más se
 * acumula: la primera versión miraba sólo el sufijo SIN cierre y eso la dejaba
 * ciega sobre 83 tipos alcanzables, entre ellos `AlbumGuest` (los roles de
 * plataforma de H-011), `UploadIntentFileSignature` (los seis campos muertos de
 * H-058) y `PhotoTag`.
 *
 * La semilla por conducta llegó después, y por la mitad que faltaba: el sufijo
 * es una convención de BAUTISMO, no una propiedad de la cosa. Medido, dos
 * respuestas reales quedaban afuera del cierre por sufijo —
 * `NotificationUnreadCount` y `OAuthMethods`, las dos devueltas por un
 * controller— y a sus campos no se les exigía lector. Verificado rompiéndolo:
 * un campo sin lector agregado a `NotificationUnreadCount` sale rojo con la
 * semilla por conducta y pasa INVISIBLE con la de sufijos.
 *
 * Los `*Request` quedan fuera aunque se los alcance: sus campos los lee el API,
 * no la app, y exigirles un lector en el cliente sería pedir lo contrario de lo
 * que son.
 *
 * ── CÓMO SE DECIDE QUE ALGUIEN LO LEE ──────────────────────────────────────
 *
 * Buscando el nombre como identificador en `memivo_client/src`. **El selector
 * es permisivo a propósito y esa asimetría es la decisión de diseño del gate**:
 * un falso negativo deja un campo muerto un tiempo más; un falso positivo hace
 * que alguien borre un campo que la app SÍ lee, y eso es una pantalla rota. Los
 * campos que se leen por spread o por acceso dinámico son justamente los que un
 * selector estricto no puede ver.
 *
 * ── EL LÍMITE, ESCRITO PARA QUE NO SE DESCUBRA DOS VECES ────────────────────
 *
 * El precio de esa permisividad es que **el gate no puede ver los campos de
 * NOMBRE COMÚN**: `roles`, `position`, `userId`, `updated_at`, `payload`,
 * `sizeBytes` aparecen escritos en el cliente sobre OTROS tipos, así que un
 * match por nombre los da por vivos. El bloque 41 los cerró a mano —salieron de
 * las fichas, no del auditor— y por eso los dos conjuntos se complementan: el
 * auditor encontró 21 que ninguna ficha tenía, y las fichas encontraron los de
 * nombre común que el auditor no puede ver.
 *
 * Endurecer el selector para taparlo exige resolución de tipos del lado del
 * cliente (un `ts.Program` sobre memivo_client con el `dist` instalado), y ese
 * `dist` hoy no coincide con el `src` de este paquete (ver D-25): el gate
 * pasaría a reportar según un artefacto desfasado, que es peor que no verlos.
 * Si algún día el repin se destraba, ése es el camino.
 *
 * ── OTRO LÍMITE, EL DE LOS 4 AUDITORES DEL PAQUETE ──────────────────────────
 *
 * Este auditor arma su universo con la anotación de retorno de los handlers
 * más la red de sufijos, y el cierre transitivo desde ahí — nunca abre un
 * `.entity.ts` ni compara contra la fila que Postgres devuelve. Lo mismo vale
 * para `audit-consumers.js` (compara símbolos declarados, incluida su forma,
 * pero sólo entre api/cliente/paquete) y para `audit-transport-surfaces.js`
 * y `audit-endpoints.js` (cruzan rutas y decoradores, no shapes). Un campo
 * que un service arma A MANO en un objeto literal, cuyo controller NO anota
 * el tipo de retorno (`Promise<XResponse>` explícito), puede driftear sin que
 * ninguno de los 4 lo vea: la protección estructural para ese caso la da
 * `tsc` del api contra la anotación, no este paquete. Que la anotación EXISTA
 * en todo handler ya lo exige `audit-transport-surfaces.js`, y es lo que
 * permite sembrar por conducta; lo que sigue sin cubrirse es que la anotación
 * sea VERDAD contra el objeto que el service arma.
 *
 * Uso: node scripts/audit-response-fields.js [--verbose]
 */
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
/**
 * LAS TRES RAÍCES, TODAS CON SU COSTURA DE ENTORNO.
 *
 * Sólo `clientSrc` la tenía, y eso dejaba a este auditor imposible de probar:
 * el universo se siembra desde el CONTRATO y desde los handlers del API, así
 * que sin poder plantar esos dos árboles no hay forma de escribir un caso que
 * ponga rojo al detector. Un auditor sin un caso que lo ponga rojo está
 * apagado, no limpio — es la misma frase con la que se abrió el arnés de
 * `audit-endpoints.js`, y los nombres de las variables de entorno son los
 * SUYOS a propósito: un solo vocabulario para toda la familia.
 */
const packageSrc = process.env.MEMIVO_AUDIT_PACKAGE_SRC
  ? resolve(process.env.MEMIVO_AUDIT_PACKAGE_SRC)
  : resolve(packageRoot, 'src');

const clientSrc = process.env.MEMIVO_AUDIT_CLIENT_SRC
  ? resolve(process.env.MEMIVO_AUDIT_CLIENT_SRC)
  : resolve(workspaceRoot, 'memivo_client', 'src');

const apiSrc = process.env.MEMIVO_AUDIT_API_SRC
  ? resolve(process.env.MEMIVO_AUDIT_API_SRC)
  : resolve(workspaceRoot, 'memivo_api', 'src');

const verbose = process.argv.includes('--verbose');

/**
 * La RED SECUNDARIA del recorrido: los sufijos con los que este árbol nombra
 * un tipo que viaja de vuelta.
 *
 * Fueron la semilla ÚNICA hasta que se midió lo que dejaban afuera. Hoy la
 * semilla primaria es la CONDUCTA —lo que un handler declara devolver, ver
 * `tiposQueLosHandlersDevuelven`— y esto queda como red de atrás: cubre los
 * tipos que todavía no llegaron a un handler (una respuesta recién escrita, un
 * tipo que el cliente arma) y no cuesta nada dejarlo puesto.
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
 * de servir. Una entrada cuyo campo ya no existe también es una excusa en
 * blanco —excusa cualquier campo futuro con ese nombre— así que el gate la
 * rechaza igual que a la que caducó por tener lector.
 */
const AUDIT_EVIDENCE =
  'audit-log: el tipo gobierna también la columna jsonb `album_action_logs.detail`, ' +
  'que es append-only y sobrevive al borrado del objeto — borrarlo es perder ' +
  'evidencia, no bytes (única respuesta a «qué se borró» / «cómo se llamaba antes»)';

// Sólo los que el gate REPORTA. `folderIds` y `newName` son de la misma
// familia y tampoco tienen lector, pero su nombre colisiona con otros tipos del
// cliente, así que el matcher permisivo los da por vivos y una excusa para
// ellos caducaría en cada corrida. Su motivo vive en el docblock del tipo, que
// es donde se lee.
/**
 * El contador de fallas de una transferencia lo consume el SERVIDOR, no el
 * cliente: es lo que decide cuál de los tres textos manda la push —«listo»,
 * «parcial» o «falló»— en `notification/constants/templates/*.ts`. El cliente
 * nunca lo leyó; hasta ahora el matcher permisivo lo daba por vivo porque el
 * nombre colisionaba con un campo propio de sus upload tasks, y al borrarse los
 * trays esa colisión desapareció y quedó a la vista.
 *
 * Borrarlo no es una opción: sin él la push de una descarga parcial diría
 * «descarga lista» sobre un lote al que le faltan fotos.
 */
const PUSH_BODY_ONLY =
  'lo lee el SERVIDOR para elegir el texto de la push (listo / parcial / falló) ' +
  'en notification/constants/templates; el cliente no muestra el número y estas ' +
  'filas ni siquiera dejan fila en la campanita';

/**
 * La animación es metadata del asset que el servidor persiste. La app recibe la
 * rendition quieta ya resuelta y decide por la presencia de `stillUrl`, así que
 * obligarla a leer la bandera duplicaría esa decisión sólo para satisfacer el
 * auditor.
 */
const STICKER_ASSET_ONLY =
  'lo lee el SERVIDOR para persistir la propiedad del asset; la app recibe ' +
  '`stillUrl` ya resuelta y no necesita conocer la regla del catálogo';

const INTENTIONAL_WITHOUT_READER = new Map([
  ['DownloadReadyMetadata.failedCount', PUSH_BODY_ONLY],
  ['PhotosBatchUploadMetadata.failedCount', PUSH_BODY_ONLY],
  ['AlbumActionDetail.folderNames', AUDIT_EVIDENCE],
  ['AlbumActionDetail.oldRole', AUDIT_EVIDENCE],
  ['AlbumActionDetail.newRole', AUDIT_EVIDENCE],
  ['AlbumActionDetail.oldName', AUDIT_EVIDENCE],
  ['AlbumActionDetail.revokedInvites', AUDIT_EVIDENCE],
  ['AlbumActionDetail.qrCodeExpiresAt', AUDIT_EVIDENCE],
  ['AlbumActionDetail.moderationReason', AUDIT_EVIDENCE],
  ['StickerReference.isAnimated', STICKER_ASSET_ONLY],
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

const clientReads = (field) => new RegExp(`\\b${field}\\b`).test(clientText);

// --- Todas las declaraciones del paquete, por nombre -----------------------
const declarations = new Map();

for (const file of collectFiles(packageSrc, ['.ts'])) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );

  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      declarations.set(node.name.text, { node, source, file });
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
}

const membersOf = ({ node }) => {
  if (ts.isInterfaceDeclaration(node)) return node.members;
  if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
    return node.type.members;
  }
  return [];
};

/** Nombres de tipo referenciados en cualquier parte de la declaración. */
const referencedTypeNames = ({ node, source }) => {
  const names = new Set();
  const walk = (current) => {
    if (ts.isTypeReferenceNode(current)) {
      names.add(current.typeName.getText(source).split('.')[0]);
    }
    if (ts.isExpressionWithTypeArguments(current)) {
      names.add(current.expression.getText(source).split('.')[0]);
    }
    ts.forEachChild(current, walk);
  };
  walk(node);
  return names;
};

/**
 * Los tipos que los handlers del api DECLARAN devolver: la semilla por
 * conducta.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El universo se sembraba por SUFIJO de nombre, y un sufijo es una convención
 * de bautismo, no una propiedad de la cosa. Medido sobre el árbol de hoy: el
 * cierre por sufijo alcanza 250 de las 367 declaraciones del paquete, y **dos
 * respuestas REALES quedaban afuera** —`NotificationUnreadCount`, que devuelve
 * `notification.controller.ts`, y `OAuthMethods`, que devuelve
 * `oauth.controller.ts`—. Los campos de esas dos no se le exigían a nadie: el
 * auditor de campos muertos no los miraba porque no se llamaban como él
 * esperaba.
 *
 * La conducta, en cambio, está GARANTIZADA por otro gate del mismo paquete:
 * `audit-transport-surfaces.js` exige que todo handler HTTP y todo
 * `@SubscribeMessage` anote su tipo de retorno, y hoy da cero en sus cuatro
 * categorías. O sea que la anotación existe siempre, y sembrar de ahí no
 * depende de que nadie se olvide.
 *
 * ── LO QUE ESTA SEMILLA TAMPOCO VE, MEDIDO ────────────────────────────────
 * Los payloads de socket que se EMITEN sin pasar por un `@SubscribeMessage`
 * —un `server.to(room).emit(...)`—: ahí no hay firma que anotar y el tipo viaja
 * como argumento. Hoy la red de sufijos los cubre a casi todos porque se llaman
 * `…Payload`, pero eso es la convención sosteniéndolos, no una garantía. Es la
 * misma frontera que el resto del archivo ya declara: lo que no tiene una
 * anotación de la que colgarse, este paquete no lo puede ver.
 */
const HTTP_METHOD_DECORATORS = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete']);

const tiposQueLosHandlersDevuelven = () => {
  const nombres = new Set();
  if (!existsSync(apiSrc)) return nombres;

  for (const file of collectFiles(apiSrc, ['.ts'])) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );

    const visit = (node) => {
      if (ts.isMethodDeclaration(node) && node.type && ts.canHaveDecorators(node)) {
        const decorators = ts.getDecorators(node) || [];
        const esHandler = decorators.some(
          (decorator) =>
            ts.isCallExpression(decorator.expression) &&
            ts.isIdentifier(decorator.expression.expression) &&
            (HTTP_METHOD_DECORATORS.has(decorator.expression.expression.text) ||
              decorator.expression.expression.text === 'SubscribeMessage'),
        );
        if (esHandler) {
          const walk = (current) => {
            if (ts.isTypeReferenceNode(current)) {
              // El alias local con el que el api importa el contrato
              // (`export type { X as IX }`) resuelve al mismo nombre, porque lo
              // que se compara es el nombre DECLARADO en el paquete.
              nombres.add(current.typeName.getText(source).split('.')[0]);
            }
            ts.forEachChild(current, walk);
          };
          walk(node.type);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(source);
  }
  return nombres;
};

const isRequestShape = (name) => name.endsWith('Request');

// Semillas + cierre transitivo. Un `*Request` alcanzado desde una respuesta
// sigue sirviendo de puente (puede contener formas que sí viajan), así que se
// recorre; lo que no se hace es exigirle lector a SUS campos.
const semillaPorConducta = tiposQueLosHandlersDevuelven();
const auditable = new Set(
  [...declarations.keys()].filter(
    (name) =>
      (semillaPorConducta.has(name) ||
        RESPONSE_SUFFIXES.some((suffix) => name.endsWith(suffix))) &&
      !isRequestShape(name),
  ),
);
const pending = [...auditable];

while (pending.length > 0) {
  const current = declarations.get(pending.pop());
  if (!current) continue;

  for (const referenced of referencedTypeNames(current)) {
    if (!declarations.has(referenced) || auditable.has(referenced)) continue;
    auditable.add(referenced);
    pending.push(referenced);
  }
}

// --- Los campos que esos tipos declaran ------------------------------------
const orphans = [];
const auditedFields = new Set();

for (const name of [...auditable].sort()) {
  if (isRequestShape(name)) continue;
  const declaration = declarations.get(name);

  for (const member of membersOf(declaration)) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    const field = member.name.getText(declaration.source);
    const qualified = `${name}.${field}`;
    auditedFields.add(qualified);

    if (INTENTIONAL_WITHOUT_READER.has(qualified)) continue;
    if (clientReads(field)) continue;

    orphans.push({
      qualified,
      where: `${relative(packageRoot, declaration.file)}:${
        declaration.source.getLineAndCharacterOfPosition(
          member.getStart(declaration.source),
        ).line + 1
      }`,
    });
  }
}

// --- Las excusas tienen que ganarse el lugar en cada corrida ---------------
/**
 * Una excusa está rancia cuando el cliente EMPEZÓ a leer ese campo — entonces deja
 * de ser «intencionalmente sin lector» y la entrada tapa cobertura real.
 *
 * EL DEFECTO QUE CIERRA. Antes preguntaba sólo por el NOMBRE del campo
 * (`qualified.split('.')[1]`), y `clientReads` es un regex sobre el texto del
 * cliente entero. Resultado: `DownloadReadyMetadata.failedCount` y
 * `PhotosBatchUploadMetadata.failedCount` salían rancias porque el cliente lee un
 * `failedCount` de OTRO tipo —el del flujo de compartir un post— mientras no
 * menciona esos dos tipos en un solo archivo. Dos excusas legítimas marcadas como
 * muertas, y el que las borrara habría sacado cobertura de verdad.
 *
 * Ahora exige las DOS mitades: que el cliente nombre el tipo Y el campo. Sigue
 * siendo reconocimiento por nombre —el alcance está declarado acá y no se
 * disimula—: no distingue dos tipos que compartan nombre de campo si el cliente
 * usa los dos. Cierra la forma en que el falso positivo apareció, no la totalidad
 * del espacio.
 */
const staleExcuses = [...INTENTIONAL_WITHOUT_READER.keys()].filter((qualified) => {
  const [type, field] = qualified.split('.');
  return clientReads(type) && clientReads(field);
});

const phantomExcuses = [...INTENTIONAL_WITHOUT_READER.keys()].filter(
  (qualified) => !auditedFields.has(qualified),
);

if (verbose) {
  process.stdout.write(
    `audit:response-fields: ${auditable.size} tipos alcanzables desde una respuesta\n`,
  );
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

if (phantomExcuses.length > 0) {
  process.stderr.write(
    '\nExcusas de INTENTIONAL_WITHOUT_READER para campos que ya no existen\n' +
      '(una excusa sin campo excusa cualquier campo futuro con ese nombre):\n',
  );
  for (const excuse of phantomExcuses) process.stderr.write(`  ✗ ${excuse}\n`);
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
  `audit:response-fields: ${auditedFields.size} campos de respuesta en ` +
    `${auditable.size} tipos, todos con lector.\n`,
);
