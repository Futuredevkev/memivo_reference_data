const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

/**
 * EL WORKFLOW DEL SSOT CORRE TODOS LOS AUDITORES QUE ESTE PAQUETE DECLARA.
 *
 * ── EL DEFECTO QUE CIERRA, medido el 4 de septiembre de 2026 ─────────────
 * `package.json` declara SEIS `audit:*` y `ssot.yml` corría CUATRO. El que
 * faltaba —`audit:route-parity`— es el ÚNICO que aparea api y cliente por
 * RUTA, o sea el que contesta la pregunta por la que existe este repo. Su
 * único disparador era el `pre-push` local del api: se saltea con
 * `--no-verify` y no existe en ninguna CI.
 *
 * El gate hermano del api (`quality-runs-every-gate`) ya exige que
 * `scripts.audit:ssot` los encadene a los seis, y estaba en verde: encadenar
 * no es correr. Los dos cortes hacen falta porque son dos puertas distintas —
 * la del desarrollador y la del runner— y ya se desincronizaron una vez.
 *
 * ── POR QUÉ EL CORTE VIVE ACÁ Y NO EN EL API ─────────────────────────────
 * Porque los dos lados de la comparación son de este repo: el `package.json`
 * que declara los auditores y el `ssot.yml` que los corre. Cruzarlos desde el
 * api pediría leer un repo hermano en disco para medir algo que no tiene una
 * sola punta allá. Y `npm test` es la puerta que las TRES vías de este repo
 * comparten —`quality`, el `pre-push` y el propio paso `test` de `ssot.yml`—,
 * así que un archivo acá queda encadenado a las tres sin editar ninguna.
 *
 * ── LA ÚNICA EXENCIÓN, CON SU MOTIVO Y CON SU CONDICIÓN ──────────────────
 * `audit:installed-version` compara el pin instalado de un CONSUMIDOR contra
 * el manifiesto de este paquete, así que necesita el `node_modules` de ese
 * consumidor. `ssot.yml` hace checkout de los tres repos pero sólo le corre
 * `npm ci` a éste: allá no hay `node_modules` que leer. La exención vale
 * MIENTRAS eso sea cierto, y el caso de abajo lo mide contra el archivo — el
 * día que el workflow le instale dependencias a un consumidor, la exención se
 * pone roja y hay que sacarla.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ────────────────────────────────────────
 * · Reconoce la invocación por el texto `npm run <auditor>` en el YAML. No
 *   parsea el workflow ni verifica que el paso esté en el job correcto: si
 *   alguien escribe el comando adentro de un `if:` que nunca se cumple, esto
 *   no lo ve. Es un piso de existencia, igual que el `invoca()` del gate
 *   hermano del api.
 * · `:verbose` no es un auditor más: es la misma medición con más salida.
 */

const ROOT = resolve(__dirname, '..');
const WORKFLOW = join(ROOT, '.github', 'workflows', 'ssot.yml');

/**
 * Los auditores que este paquete publica, derivados y no transcritos: cuántos
 * son se pudre al primero que se agregue (ORDEN §4).
 */
const auditores = () => {
  const { scripts = {} } = JSON.parse(
    readFileSync(join(ROOT, 'package.json'), 'utf8'),
  );
  return Object.keys(scripts).filter(
    (nombre) => nombre.startsWith('audit:') && !nombre.endsWith(':verbose'),
  );
};

/**
 * Los que el workflow NO corre, con el motivo escrito. La clave es el nombre
 * del script; el valor, por qué no puede correr ahí.
 */
const EXENTOS = new Map([
  [
    'audit:installed-version',
    'lee el `node_modules` de un consumidor, y `ssot.yml` sólo le corre `npm ci` a este repo',
  ],
]);

const yaml = () => readFileSync(WORKFLOW, 'utf8');

/**
 * `npm run <auditor>` seguido de algo que NO continúa el nombre.
 *
 * El corte va por regex y no por `includes` de la línea entera por dos razones
 * medidas: los finales de línea del repo son CRLF en Windows —un
 * `includes('… \n')` no matchea nunca—, y `npm run audit:endpoints` es prefijo
 * de `npm run audit:endpoints:verbose`, que es la MISMA medición y no cuenta
 * como correr al auditor por su nombre.
 */
const corre = (texto, auditor) =>
  new RegExp(`npm run ${auditor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w:-])`).test(
    texto,
  );

test('mide algo: el paquete declara auditores y el workflow existe', () => {
  // Control de vacío por las dos puntas. Sin esto, un `package.json` sin
  // `audit:*` —o un workflow renombrado— dejaría el caso de abajo comparando
  // dos listas vacías y en verde sobre la nada.
  assert.ok(auditores().length > 0, 'el paquete no declara ningún `audit:*`');
  assert.ok(yaml().length > 0, `falta ${WORKFLOW}`);
});

test('`ssot.yml` corre todos los auditores, salvo el exento declarado', () => {
  const texto = yaml();
  const afuera = auditores().filter(
    (auditor) => !EXENTOS.has(auditor) && !corre(texto, auditor),
  );

  assert.deepEqual(
    afuera,
    [],
    `estos auditores no los corre ssot.yml: ${afuera.join(', ')}`,
  );
});

test('la exención se audita sola: sigue siendo candidata y sigue sin correr', () => {
  const texto = yaml();
  const declarados = auditores();

  for (const [auditor, motivo] of EXENTOS) {
    assert.ok(
      declarados.includes(auditor),
      `\`${auditor}\` está exento y ya no es un auditor de este paquete: sacá la entrada`,
    );
    assert.ok(
      !corre(texto, auditor),
      `\`${auditor}\` está exento y el workflow SÍ lo corre: sacá la entrada`,
    );
    assert.ok(
      motivo.length >= 40,
      `la exención de \`${auditor}\` no explica nada`,
    );
  }
});

test('la condición que sostiene la exención sigue siendo verdad', () => {
  // `audit:installed-version` está exento porque el workflow no le instala
  // dependencias a ningún consumidor. Si mañana alguien agrega ese `npm ci`,
  // la exención deja de valer y esto lo dice en vez de dejarla en pie.
  const texto = yaml();
  const instalaAConsumidores =
    /working-directory:\s*memivo_(api|client)[\s\S]{0,200}?npm ci/.test(texto);

  assert.equal(
    instalaAConsumidores,
    false,
    '`ssot.yml` ya le instala dependencias a un consumidor: `audit:installed-version` puede correr y la exención tiene que caer',
  );
});

/**
 * Los repos hermanos que el `npm test` de este workflow necesita en disco.
 *
 * No se escriben acá: se LEEN del gate que los pide. `gate-corpus-control-
 * positive-ratio` recorre los gates de los cuatro repos y **falla fuerte**
 * cuando le falta uno —«un gate cross-repo que no puede leer a los otros no
 * está pasando, está ciego»—, así que la lista vive donde se usa y este caso
 * sólo comprueba que la CI la respete.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El gate nació el 31 de agosto pidiendo CUATRO hermanos y el workflow hacía
 * checkout de TRES: el único gate que cruza los cuatro repos no podía pasar en
 * ninguna CI, y nada lo decía porque las dos listas vivían separadas. Es la
 * misma forma que el caso de los auditores de arriba: un requisito escrito de
 * un lado y una CI que no lo sabe.
 */
const reposQueElCorpusPide = () => {
  const fuente = readFileSync(
    join(__dirname, 'gate-corpus-control-positive-ratio.test.js'),
    'utf8',
  );
  return [...fuente.matchAll(/repo:\s*'([^']+)'/g)].map((match) => match[1]);
};

/** `path: <repo>` en un paso de checkout del workflow. */
const haceCheckout = (texto, repo) =>
  new RegExp(String.raw`path:\s*${repo}\s*$`, 'm').test(texto);

test('el workflow hace checkout de todos los hermanos que un gate necesita', () => {
  const pedidos = reposQueElCorpusPide();

  assert.ok(
    pedidos.length >= 4,
    'el lector del corpus no encontró los repos: el sospechoso es el reconocedor, no la CI',
  );

  assert.deepEqual(
    pedidos.filter((repo) => !haceCheckout(yaml(), repo)),
    [],
    'un gate de este repo lee ese hermano y `ssot.yml` no lo trae: el gate no ' +
      'puede pasar en CI, y su rojo diría «falta el repo» en vez de «falta el checkout»',
  );
});

test('el reconocedor de checkouts engancha: distingue traer un repo de nombrarlo', () => {
  // Sin esto, un `path:` que cambie de forma dejaría el caso de arriba en verde
  // por no encontrar nada — el modo de falla mudo de ORDEN §10.
  assert.equal(haceCheckout('        with:\n          path: memivo_api\n', 'memivo_api'), true);
  assert.equal(haceCheckout('        # clonar memivo_api sería lindo\n', 'memivo_api'), false);
});
