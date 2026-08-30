const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, readdirSync, readFileSync, rmSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');
const { tmpdir } = require('node:os');

/**
 * EL `dist/` COMMITEADO ES EL `src/` COMPILADO, Y ESO SE MIDE.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `dist/` se commitea a propósito —lo dice `.gitignore`: «se commitea para que
 * `npm install github:...` funcione sin necesidad de toolchain de build en el
 * consumidor»— y es exactamente lo que el tarball del tag le entrega al api y
 * al cliente. Pero ningún gate lo comparaba contra `src/`:
 *
 *  · `quality` encadena cuatro auditores, `npm test` y la versión instalada.
 *    No corre `build` ni `tsc`.
 *  · `.githooks/pre-push` corre esos mismos auditores. Tampoco.
 *  · `.github/workflows/ssot.yml` hace `npm ci` y va directo a los auditores.
 *
 * O sea que «acordate de correr `npm run build` antes de taguear» era un paso
 * HUMANO, y los cinco gates salían en verde igual con un `dist` viejo. Y no es
 * cosmético: `audit-consumers.js` mide contra las DOS mitades a la vez —carga
 * `dist/index.js` para el runtime y recorre `src/` con el AST para las
 * declaraciones—, así que con un `dist` desfasado las dos mitades hablan de
 * árboles distintos y el reporte sale verde. `audit-transport-surfaces.js` y
 * `audit-response-fields.js` leen SÓLO `src/`: un `dist` viejo les pasa por
 * delante sin que lo vean. El síntoma que produce está a un repo de distancia y
 * no se parece a su causa: el `TS2305` que `audit-installed-version.js`
 * documenta como «no menciona ni a npm ni al tag».
 *
 * NO ES HIPOTÉTICO. La primera corrida de este gate encontró el desfase puesto:
 * nueve archivos de `src/chat/**` sin su par en `dist/`, y los cuatro barrels
 * de esas carpetas distintos. O sea que el paso humano ya se había salteado.
 *
 * ── POR QUÉ VIVE EN `test/` Y NO EN `quality` ─────────────────────────────
 * Porque `npm test` es `node --test`, y las TRES puertas —`quality`, el
 * `pre-push` y el paso `test` de `ssot.yml`— ya lo corren. Un archivo acá queda
 * encadenado a las tres de una sola vez, sin editar ninguna: encadenarlo a
 * `quality` habría cubierto una y dejado las otras dos sin red.
 *
 * ── EL ORÁCULO ES EL COMPILADOR, NO UNA HEURÍSTICA ────────────────────────
 * No compara fechas ni cuenta archivos: compila `src/` con el MISMO
 * `tsconfig.json` que usa `npm run build`, a un directorio temporal, y compara
 * byte a byte. Una comparación por mtime daría verde sobre un `dist` que
 * alguien tocó a mano, y daría rojo sobre un clon recién hecho.
 *
 * ── ALCANCE, ESCRITO (ORDEN §10) ──────────────────────────────────────────
 * 1. Compara el EMITIDO, no el publicado: si `package.json` exportara un
 *    archivo que `tsc` no emite, esto no lo ve. Eso lo miran `audit:consumers`
 *    y `audit:installed-version`.
 * 2. Usa el `typescript` de `devDependencies`. Si esa versión se mueve, el
 *    emitido puede cambiar sin que `src/` cambie: es correcto que el gate se
 *    ponga rojo ahí, porque el `dist` commiteado dejó de ser el que produce el
 *    toolchain de hoy.
 * 3. `npm run build` limpia `dist/` antes de compilar (`scripts/clean-dist.js`),
 *    así que un archivo que SOBRA en `dist/` también es desfase y se reporta.
 */

const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const TSC = join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');

/** Todas las hojas de un árbol, en clave relativa con `/`, ordenadas. */
const leaves = (root) => {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(relative(root, full).split(sep).join('/'));
    }
  };
  walk(root);
  return out.sort();
};

/**
 * Compila `src/` a un temporal y devuelve sus hojas. Se hace UNA vez para los
 * tres casos: `tsc` sobre este árbol tarda ~2 s, y correrlo tres veces sería
 * pagar seis por una respuesta que no cambia entre casos.
 */
const compiled = (() => {
  const out = mkdtempSync(join(tmpdir(), 'memivo-contracts-dist-'));
  try {
    execFileSync(process.execPath, [TSC, '-p', join(ROOT, 'tsconfig.json'), '--outDir', out], {
      cwd: ROOT,
      stdio: 'pipe',
    });
  } catch (error) {
    rmSync(out, { recursive: true, force: true });
    const salida = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
    throw new Error(
      `\`tsc -p tsconfig.json\` no compila, así que no hay con qué comparar el \`dist/\` commiteado:\n${salida}`,
    );
  }
  return { dir: out, files: leaves(out) };
})();

process.on('exit', () => rmSync(compiled.dir, { recursive: true, force: true }));

test('el gate mide algo: `src/` compila y emite un árbol entero', () => {
  // Un `outDir` vacío compararía dos conjuntos vacíos y daría verde sin haber
  // mirado nada: el gate estaría apagado, no limpio.
  assert.ok(
    compiled.files.length > 500,
    `\`tsc\` emitió ${compiled.files.length} archivos: el roto es la compilación, no el \`dist/\``,
  );
});

test('`dist/` tiene exactamente los archivos que `tsc` emite', () => {
  const emitidos = new Set(compiled.files);
  const commiteados = new Set(leaves(DIST));

  const faltan = compiled.files.filter((file) => !commiteados.has(file));
  const sobran = [...commiteados].filter((file) => !emitidos.has(file)).sort();

  assert.deepEqual(
    { faltan, sobran },
    { faltan: [], sobran: [] },
    '`dist/` desfasado: corré `npm run build` y commiteá.',
  );
});

test('todo archivo de `dist/` es byte a byte el que `tsc` emite', () => {
  const commiteados = new Set(leaves(DIST));
  const distintos = compiled.files.filter(
    (file) =>
      commiteados.has(file) &&
      !readFileSync(join(compiled.dir, file)).equals(readFileSync(join(DIST, file))),
  );

  assert.deepEqual(
    distintos,
    [],
    '`dist/` desfasado: corré `npm run build` y commiteá.',
  );
});
