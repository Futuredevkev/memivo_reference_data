const test = require('node:test');
const assert = require('node:assert/strict');
const { readdirSync, readFileSync, statSync } = require('node:fs');
const { relative, resolve, sep } = require('node:path');

const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

/**
 * **DOS BLOQUES JSDoc SEGUIDOS SON UNO SOLO, Y EL DE ARRIBA NO EXISTE.**
 *
 * ── EL DEFECTO QUE CIERRA, Y ESTE REPO LO PRODUJO ─────────────────────────
 * TypeScript asocia a un símbolo ÚNICAMENTE el último bloque JSDoc que lo
 * precede. El de más arriba no queda «también»: queda inerte. No lo muestra el
 * tooltip, no viaja al `.d.ts` como documentación del símbolo, y —lo que
 * importa— sigue leyéndose perfecto en el fuente, así que quien pasa por ahí
 * cree que el símbolo de abajo está documentado cuando en realidad está
 * describiendo a otro.
 *
 * Es ORDEN §13 con todas las letras, y acá no es teórico: la regla del horario
 * de publicación tenía el docblock de `nextDailyStateChange` —veintiséis
 * renglones que explican por qué el borde no se puede calcular a ciegas el día
 * del cambio de hora— pegado ARRIBA del de `lastDailyOpening`, o sea sobre la
 * función equivocada. La función que ese texto explica había quedado muda.
 *
 * ── POR QUÉ ESTE REPO NECESITABA EL SUYO ──────────────────────────────────
 * Los dos consumidores tienen un gate de docblocks —gemelos declarados,
 * `docblock-describes-what-follows`— que persigue SEIS formas, y ésta es una de
 * ellas. Este paquete no tenía ninguna, y su `src/` es el más denso en prosa de
 * los tres: cada regla que cruza el cable lleva su porqué escrito. El defecto
 * apareció exactamente acá y ningún instrumento de los tres repos podía verlo.
 *
 * **No se declara `@gemelo`** a propósito: los gemelos son PAREJAS y esos dos
 * ya lo son entre sí. Éste persigue una sola de las seis formas, que es la que
 * se puede detectar sin montar el compilador, y lo dice.
 *
 * ── LO QUE ESTE GATE NO MIDE (ORDEN §15) ──────────────────────────────────
 *  · **Sólo la forma TAPADA.** Las otras cinco —el huérfano, el de mudanza, el
 *    que enumera consumidores— viven en los gates de los consumidores. Acá no
 *    se vende completitud que no hay.
 *  · **No juzga el CONTENIDO.** Que el bloque que queda describa lo que tiene
 *    debajo no es mecánico; lo que se afirma es que no haya uno inerte encima.
 *  · **Es un escáner léxico, no un parser.** Reconoce el cierre de un bloque y
 *    la apertura del siguiente separados sólo por líneas en blanco. Un `/**`
 *    adentro de un string no existe en este árbol, y el control positivo de
 *    abajo se cae si el detector deja de enganchar.
 */

const archivosTs = (dir) =>
  readdirSync(dir).flatMap((entrada) => {
    const ruta = resolve(dir, entrada);
    if (statSync(ruta).isDirectory()) return archivosTs(ruta);
    return entrada.endsWith('.ts') ? [ruta] : [];
  });

/**
 * Dónde queda un bloque JSDoc tapado por el siguiente: se devuelve la línea
 * (1-based) del bloque INERTE, que es el que hay que mover.
 */
const bloquesTapados = (source) => {
  const lineas = source.split('\n');
  const tapados = [];

  for (let i = 0; i < lineas.length; i += 1) {
    if (lineas[i].trim() !== '*/') continue;

    let j = i + 1;
    while (j < lineas.length && lineas[j].trim() === '') j += 1;
    if (j >= lineas.length) continue;
    if (lineas[j].trim() !== '/**') continue;

    // Se busca hacia atrás la apertura del bloque que acaba de cerrar, para
    // reportar dónde empieza lo que quedó inerte y no dónde termina.
    let abre = i;
    while (abre >= 0 && lineas[abre].trim() !== '/**') abre -= 1;
    tapados.push(abre + 1);
  }

  return tapados;
};

const fuentes = archivosTs(SRC).map((ruta) => ({
  rel: relative(ROOT, ruta).split(sep).join('/'),
  code: readFileSync(ruta, 'utf8'),
}));

/**
 * El piso que impide aprobar por vacío: si el recorrido dejara de encontrar el
 * árbol, la regla pasaría sobre cero archivos — que es un gate apagado y no uno
 * limpio.
 */
test('mide algo: ve el árbol de `src/`', () => {
  assert.ok(
    fuentes.length > 200,
    `el recorrido devolvió ${fuentes.length} archivos: sin corpus no se mide nada`,
  );
});

test('el detector reconoce la forma tapada, y no la buena', () => {
  const tapado = ['/**', ' * arriba', ' */', '/**', ' * abajo', ' */', 'const x = 1;'].join('\n');
  assert.deepEqual(bloquesTapados(tapado), [1]);

  // Con una línea en blanco en el medio sigue estando tapado: TypeScript no
  // cambia de opinión por un renglón vacío.
  const conBlanco = ['/**', ' * arriba', ' */', '', '/**', ' * abajo', ' */', 'const x = 1;'].join('\n');
  assert.deepEqual(bloquesTapados(conBlanco), [1]);

  // Los controles NEGATIVOS: un bloque con su símbolo debajo, y dos bloques
  // separados por código, que es la forma normal de un archivo.
  const sano = ['/**', ' * solo', ' */', 'const x = 1;'].join('\n');
  assert.deepEqual(bloquesTapados(sano), []);

  const dosSanos = [
    '/**', ' * uno', ' */', 'const a = 1;', '',
    '/**', ' * dos', ' */', 'const b = 2;',
  ].join('\n');
  assert.deepEqual(bloquesTapados(dosSanos), []);
});

test('ningún docblock de `src/` queda tapado por el siguiente', () => {
  const ofensores = fuentes.flatMap(({ rel, code }) =>
    bloquesTapados(code).map(
      (linea) =>
        `${rel}:${linea} → este bloque JSDoc está tapado por el que le sigue. ` +
        'TypeScript asocia al símbolo SÓLO el último, así que éste quedó inerte: ' +
        'no lo muestra el tooltip, no viaja al `.d.ts` y sigue leyéndose como si ' +
        'documentara algo. Movelo hasta el símbolo que describe, o fundilo con el ' +
        'de abajo si describen lo mismo.',
    ),
  );

  assert.deepEqual(ofensores, []);
});
