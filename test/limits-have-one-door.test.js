const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join, resolve } = require('node:path');

/**
 * UN TOPE DEL CONTRATO TIENE UNA SOLA PUERTA.
 *
 * ── EL DEFECTO QUE CIERRA, medido ────────────────────────────────────────
 * `src/validation/limits/` publicaba sus constantes por DOS puertas: el barrel,
 * que las exporta a las 41 por nombre, y un agregado `VALIDATION` que juntaba
 * **30 de las 41 y nada decidía cuáles**. Una constante nueva entraba —o no— en
 * silencio: no rompía `tsc`, ni `lint`, ni `knip`, ni un test.
 * `grep -rln VALIDATION test/` daba CERO. La ola que agregó `SEARCH_TERM_MAX`
 * la dejó afuera del agregado y escribió el criterio en el mensaje del commit.
 *
 * Y las dos puertas se usaban de verdad: `comment/dto/create-comment.dto.ts` del
 * api importaba `COMMENT_MAX` por nombre mientras `story-comment/dto/` —mismo
 * directorio hermano, mismo decorador, mismo número— leía `VALIDATION.COMMENT_MAX`.
 *
 * ── POR QUÉ EL AGREGADO SE BORRÓ EN VEZ DE COMPLETARSE ───────────────────
 * Porque completarlo lo dejaba siendo un DUPLICADO EXACTO del barrel: los
 * mismos 41 nombres publicados dos veces, con un gate cuyo trabajo sería
 * mantener sincronizadas las dos copias. Eso es ORDEN §1 al revés. La pregunta
 * «cuáles entran» sólo deja de existir cuando el agregado no está.
 *
 * ── LA REGLA, Y POR QUÉ ES ÉSTA ──────────────────────────────────────────
 * **Ningún archivo de `limits/` importa a un hermano de `limits/`.** Un tope es
 * un número que se sostiene solo; lo único que los junta es el barrel, y el
 * barrel lo hace con `export *`, sin importar a nadie. Con esa regla el
 * agregado no se puede volver a escribir: para juntar treinta constantes hay
 * que importarlas.
 *
 * Se eligió sobre la alternativa —«ningún archivo publica un objeto que
 * contenga a otras constantes»— porque ésa se esquiva con un `Object.assign` o
 * con un spread, y ésta corta antes: sin el import no hay nada que juntar.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ────────────────────────────────────────
 * · Cubre `src/validation/limits/`. Otras carpetas del paquete SÍ tienen
 *   agregados legítimos —una tabla `Record<Union, …>` que obliga a decidir por
 *   `tsc` es lo contrario de este defecto—, así que la regla no se generaliza.
 * · Reconoce por TEXTO el `from './…'` de un import. Un `require()` dinámico le
 *   pasaría por al lado; este paquete es TypeScript con imports estáticos y el
 *   caso de vacío de abajo impide que la regla apruebe por no encontrar nada.
 */

const LIMITS = resolve(__dirname, '..', 'src', 'validation', 'limits');

const archivosDeLimites = () =>
  readdirSync(LIMITS).filter((nombre) => nombre.endsWith('.constant.ts'));

const fuente = (nombre) => readFileSync(join(LIMITS, nombre), 'utf8');

/** `from './algo'` o `from "./algo"` — un import a un hermano de la carpeta. */
const IMPORTA_A_UN_HERMANO = /from\s+['"]\.\/[^'"]+['"]/;

test('mide algo: la carpeta tiene topes y el barrel los publica a todos', () => {
  // Control de vacío por las dos puntas. Sin esto, una carpeta renombrada
  // dejaría las reglas de abajo corriendo sobre listas vacías — la forma más
  // común de que un gate deje de cortar.
  const archivos = archivosDeLimites();
  assert.ok(archivos.length >= 30, `sólo ${archivos.length} topes: el sospechoso es el lector`);

  const barrel = readFileSync(join(LIMITS, 'index.ts'), 'utf8');
  const exportados = archivos.filter((nombre) =>
    barrel.includes(`export * from './${nombre.replace(/\.ts$/, '')}'`),
  );

  assert.deepEqual(
    archivos.filter((nombre) => !exportados.includes(nombre)),
    [],
    'un tope que el barrel no publica es un tope que nadie puede importar por su nombre, ' +
      'y es exactamente la condición que hacía falta un agregado para tapar',
  );
});

test('ningún tope importa a un hermano: el agregado no se puede volver a escribir', () => {
  const ofensores = archivosDeLimites()
    .filter((nombre) => IMPORTA_A_UN_HERMANO.test(fuente(nombre)))
    .map(
      (nombre) =>
        `${nombre} importa a un hermano de \`limits/\`. Un tope es un número que se ` +
        'sostiene solo; lo único que los junta es el barrel, con `export *`. Juntar ' +
        'constantes en un objeto es la segunda puerta que este paquete ya borró una vez ' +
        '(el agregado `VALIDATION`, que publicaba 30 de 41 sin que nada decidiera cuáles).',
    );

  assert.deepEqual(ofensores, []);
});

test('el reconocedor engancha: distingue importar de nombrar', () => {
  // Sin esto, un cambio de forma en los imports dejaría la regla de arriba
  // verde por no encontrar nada.
  assert.equal(IMPORTA_A_UN_HERMANO.test("import { X } from './x.constant';"), true);
  assert.equal(IMPORTA_A_UN_HERMANO.test('import { X } from "./x.constant";'), true);
  assert.equal(
    IMPORTA_A_UN_HERMANO.test("/** Hermano de `./comment-max.constant`. */"),
    false,
    'Un docblock que lo nombra no lo importa.',
  );
  assert.equal(
    IMPORTA_A_UN_HERMANO.test("import { X } from '../otra-carpeta/x';"),
    false,
    'Un import fuera de la carpeta no es el defecto: el agregado juntaba HERMANOS.',
  );
});

test('el agregado `VALIDATION` no volvió a nacer', () => {
  // El control anclado al defecto histórico. Si alguien lo reescribe con otro
  // nombre, lo caza la regla de arriba; si lo reescribe con ÉSTE, lo caza acá y
  // el mensaje le dice por qué se fue.
  const conElAgregado = archivosDeLimites().filter((nombre) =>
    /export const VALIDATION\b/.test(fuente(nombre)),
  );

  assert.deepEqual(
    conElAgregado,
    [],
    'volvió el agregado `VALIDATION`. Publicaba 30 de 41 topes sin que nada decidiera ' +
      'cuáles, y sus consumidores leían el mismo número por dos puertas. El barrel ya ' +
      'los publica a todos por nombre.',
  );
});
