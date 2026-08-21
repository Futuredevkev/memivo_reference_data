const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync, statSync } = require('node:fs');
const { relative, resolve, sep } = require('node:path');

const root = resolve(__dirname, '..', 'src');
const expectedDomains = [
  'album',
  'auth',
  'chat',
  'common',
  'downloads',
  'errors',
  'highlights',
  'media',
  'notifications',
  'polls',
  'reactions',
  'reference-data',
  'reports',
  'sockets',
  'social',
  'stories',
  'validation',
];

test('todos los dominios tienen un barrel explícito', () => {
  for (const domain of expectedDomains) {
    assert.ok(existsSync(resolve(root, domain, 'index.ts')), `${domain}/index.ts`);
  }
});

test('el root no acumula contratos sueltos', () => {
  const looseTypeScriptFiles = readdirSync(root).filter((entry) => {
    const path = resolve(root, entry);
    return statSync(path).isFile() && entry.endsWith('.ts') && entry !== 'index.ts';
  });

  assert.deepEqual(looseTypeScriptFiles, []);
});

/**
 * Un barrel que HOY está ordenado alfabéticamente no puede dejar de estarlo.
 *
 * `validation/limits/index.ts` mantenía el orden en 37 de sus 40 líneas y los
 * dos exports nuevos de `IDEMPOTENCY_KEY_*` se pegaron al final. El síntoma no
 * es estético: el próximo que agregue un límite mira el final del archivo, ve
 * dos entradas fuera de orden y apenda la suya también — el orden se pierde de
 * a una línea. El contraste del mismo día lo prueba: `patterns/index.ts`
 * recibió `client-temp-id-pattern` en su posición alfabética correcta.
 *
 * Se congela sólo lo que YA cumple. Los barrels que nunca estuvieron ordenados
 * quedan afuera a propósito: reordenar un `export *` puede cambiar cómo se
 * resuelve una colisión de nombres, y no es algo que valga la pena arriesgar
 * por prolijidad en archivos que nadie tocó.
 *
 * ── POR QUÉ SON 55 Y NO 3 ──────────────────────────────────────────────────
 * La lista arrancó con 3 y esos 3 no tenían nada especial: son los barrels que
 * H-012 tocó ese día. La regla de arriba («se congela lo que YA cumple») decía
 * una cosa y la lista otra. Medido sobre los 65 `index.ts` de `src/`:
 *
 *   55  barrels PUROS de re-export y YA ordenados  -> entran, son SORTED_BARRELS
 *    7  barrels PUROS que NUNCA estuvieron ordenados -> UNSORTED_BARRELS
 *    3  barrels NO puros (mezclan `import`/`export {…}`) -> fuera por forma
 *
 * O sea los otros 52 ya cumplían: ampliar el gate no reordenó ni una línea, sólo
 * dejó de mirar para otro lado en 52 archivos que estaban bien y podían dejar de
 * estarlo en silencio. El riesgo que la regla de arriba describe (reordenar un
 * `export *`) NO se corrió: los desordenados siguieron intactos.
 *
 * ⚠️ **Los números de arriba son la MEDICIÓN del día que la lista se amplió, no
 * el estado de hoy.** El trinquete los mueve: N1c ordenó
 * `sockets/interfaces/index.ts` al agregarle dos exports, y el caso de abajo
 * hizo lo que tiene que hacer — exigir que se mudara a la lista congelada—.
 * Hoy son **56 y 6**. Se anota en vez de reescribir la medición porque lo que
 * explica la lista es de dónde salió, y el conteo vivo lo contestan los dos
 * arrays.
 */
const SORTED_BARRELS = [
  'album/enums/index.ts',
  'album/index.ts',
  'auth/constants/index.ts',
  'auth/enums/index.ts',
  'auth/index.ts',
  'chat/constants/index.ts',
  'chat/enums/index.ts',
  'chat/index.ts',
  'chat/interfaces/index.ts',
  'chat/types/index.ts',
  'common/constants/index.ts',
  'common/enums/index.ts',
  'common/helpers/index.ts',
  'common/index.ts',
  'common/interfaces/index.ts',
  'downloads/constants/index.ts',
  'downloads/enums/index.ts',
  'downloads/index.ts',
  'downloads/interfaces/index.ts',
  'highlights/constants/index.ts',
  'highlights/enums/index.ts',
  'highlights/index.ts',
  'highlights/interfaces/index.ts',
  'highlights/types/index.ts',
  'media/constants/index.ts',
  'media/enums/index.ts',
  'media/index.ts',
  'media/interfaces/index.ts',
  'media/types/index.ts',
  'notifications/constants/index.ts',
  'notifications/enums/index.ts',
  'notifications/index.ts',
  'notifications/interfaces/index.ts',
  'polls/enums/index.ts',
  'polls/index.ts',
  'polls/interfaces/index.ts',
  'reactions/constants/index.ts',
  'reactions/enums/index.ts',
  'reactions/index.ts',
  'reactions/interfaces/index.ts',
  'reference-data/iso-country-codes/index.ts',
  'reports/enums/index.ts',
  'reports/index.ts',
  'reports/interfaces/index.ts',
  'social/display-aspect-ratio/index.ts',
  'social/enums/index.ts',
  'sockets/constants/index.ts',
  'sockets/index.ts',
  'sockets/interfaces/index.ts',
  'stories/enums/index.ts',
  'stories/index.ts',
  'stories/types/index.ts',
  'validation/common-passwords/index.ts',
  'validation/index.ts',
  'validation/limits/index.ts',
  'validation/patterns/index.ts',
];

/**
 * Los barrels PUROS que nunca estuvieron ordenados. No se tocan —ése es el
 * riesgo que el docblock de arriba declina correr— pero se declaran, porque una
 * lista de exclusión implícita («todo lo que no está en SORTED_BARRELS») deja
 * que un barrel NUEVO nazca desordenado sin que nadie se entere. Con las dos
 * listas explícitas, el tercer test obliga a clasificar cada barrel nuevo.
 *
 * La primera divergencia de cada uno, para que se vea que son desórdenes viejos
 * y no una línea suelta:
 *   album/interfaces   línea  1  `album-access-response-album` antes que `album-access-password-response`
 *   auth/interfaces    línea 24  `register-push-device-request` antes que `regenerate-backup-codes-response`
 *   index.ts           línea  1  `reference-data` primero, delante de `album`
 *   social/index.ts    línea  1  `display-aspect-ratio` antes que `comment-context-limits.constant`
 *   social/interfaces  línea  2  `comment-created-response` antes que `comment-context-meta`
 *   sockets/interfaces línea 26  `hidden-ids-changed-payload` antes que `group-created-payload`
 *   stories/interfaces línea  4  `story-overlay-position` antes que `story-author`
 */
const UNSORTED_BARRELS = [
  'album/interfaces/index.ts',
  'auth/interfaces/index.ts',
  'index.ts',
  'social/index.ts',
  'social/interfaces/index.ts',
  'stories/interfaces/index.ts',
];

test('los barrels que están ordenados siguen ordenados', () => {
  const { readFileSync } = require('node:fs');
  for (const relative of SORTED_BARRELS) {
    const path = resolve(root, relative);
    assert.ok(existsSync(path), `${relative} no existe`);
    const lines = readFileSync(path, 'utf8')
      .split('\n')
      .filter((line) => line.trim().length > 0);
    // Sólo barrels PUROS de re-export. `errors/index.ts` mezcla imports con un
    // bloque `export { … }`, y ahí «ordenado alfabéticamente» no significa
    // nada: se probó incluirlo y el gate reordenaba el archivo entero.
    assert.ok(
      lines.every((line) => line.startsWith("export * from '")),
      `${relative} no es un barrel puro de re-export: sacalo de la lista`,
    );
    assert.deepEqual(
      lines,
      [...lines].sort(),
      `${relative} dejó de estar ordenado alfabéticamente`,
    );
  }
});

/** Todos los `index.ts` de `src/`, relativos a `src/`, con `/` como separador. */
const allBarrels = (dir = root, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) allBarrels(full, out);
    else if (entry === 'index.ts') {
      out.push(relative(root, full).split(sep).join('/'));
    }
  }
  return out;
};

/**
 * El test que impide que la clasificación se pudra. Un barrel nuevo tiene que
 * entrar a UNA de las dos listas: si nace ordenado va a SORTED_BARRELS y queda
 * congelado; si nace desordenado va a UNSORTED_BARRELS y eso es una decisión
 * escrita. Sin este test, «todo lo que no está en SORTED_BARRELS» es una puerta
 * abierta y el gate se degrada solo — que es exactamente lo que pasó cuando la
 * lista tenía 3 de 55.
 *
 * Los barrels que NO son re-export puro quedan afuera por forma, no por olvido:
 * `errors/index.ts` mezcla `import`s con un bloque `export { … }`, y ahí
 * «ordenado alfabéticamente» no significa nada.
 */
test('todo barrel puro de re-export está clasificado como ordenado o como no-ordenado', () => {
  const { readFileSync } = require('node:fs');
  const clasificados = new Set([...SORTED_BARRELS, ...UNSORTED_BARRELS]);

  const sinClasificar = allBarrels()
    .filter((relativePath) => {
      const lines = readFileSync(resolve(root, relativePath), 'utf8')
        .split('\n')
        .filter((line) => line.trim().length > 0);
      return (
        lines.length > 0 && lines.every((line) => line.startsWith("export * from '"))
      );
    })
    .filter((relativePath) => !clasificados.has(relativePath))
    .sort();

  assert.deepEqual(
    sinClasificar,
    [],
    'barrel puro sin clasificar: si está ordenado sumalo a SORTED_BARRELS, si no a UNSORTED_BARRELS',
  );
});

/** Una entrada de UNSORTED_BARRELS que ya se ordenó tiene que mudarse de lista. */
test('ningún barrel de UNSORTED_BARRELS quedó ordenado sin mudarse de lista', () => {
  const { readFileSync } = require('node:fs');
  const yaOrdenados = UNSORTED_BARRELS.filter((relativePath) => {
    const lines = readFileSync(resolve(root, relativePath), 'utf8')
      .split('\n')
      .filter((line) => line.trim().length > 0);
    return JSON.stringify(lines) === JSON.stringify([...lines].sort());
  }).sort();

  assert.deepEqual(
    yaOrdenados,
    [],
    'este barrel ya está ordenado: movelo a SORTED_BARRELS para que quede congelado',
  );
});
