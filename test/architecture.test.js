const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync, statSync } = require('node:fs');
const { resolve } = require('node:path');

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
 */
const SORTED_BARRELS = [
  'validation/limits/index.ts',
  'validation/patterns/index.ts',
  'common/helpers/index.ts',
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
