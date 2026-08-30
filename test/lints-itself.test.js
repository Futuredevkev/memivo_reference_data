const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join, resolve } = require('node:path');

const {
  MULTI_EXPORT_BUDGET,
  MULTI_EXPORT_INVENTORY,
} = require('../eslint-inventories/multi-export-inventory.js');

/**
 * EL PAQUETE CORRE SOBRE SÍ MISMO LA REGLA QUE PUBLICA.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `one-exported-symbol-per-file` vive en `eslint/` de este paquete y la
 * consumen los dos repos. El repo donde la regla VIVE era el único de los tres
 * que no corría ninguna: no había `eslint.config.mjs` ni `.eslintrc*`, y
 * `node_modules/.bin` sólo tenía `tsc`. Medido con la regla misma sobre las
 * hojas de `src/`: **8 archivos publican más de un símbolo**, 18 símbolos en
 * total.
 *
 * ── POR QUÉ ESTO VIVE EN `test/` Y NO SÓLO EN EL SCRIPT `quality` ────────
 * Porque `quality` es UNA de las tres puertas. Las otras dos son
 * `.githooks/pre-push` y el paso `test` de `.github/workflows/ssot.yml`, y las
 * tres corren `npm test`. Un archivo acá queda encadenado a las tres de una
 * sola vez sin editar ninguna — el mismo razonamiento, y el mismo lugar, que
 * `dist-matches-src`. `lint` se agrega igual al script `quality`, para que
 * quien corra el gate a mano lo vea aparte y con el reporte de ESLint completo.
 *
 * ── ALCANCE, ESCRITO (ORDEN §10) ────────────────────────────────────────
 * 1. Corre el binario de ESLint con la config del repo, así que mide lo que el
 *    linter mide: si mañana la config suma reglas, esto las cubre solo.
 * 2. NO reimplementa el criterio de la regla. Ésa es exactamente la trampa que
 *    ya se pagó en este hallazgo: la réplica a mano contaba 16 y la regla
 *    cuenta 8, porque el idioma `const X` + `type X` es UN concepto y la regla
 *    lo sabe. **El oráculo es la regla, no una réplica de la regla.**
 * 3. El presupuesto de abajo NO lo mide ESLint: la regla acepta el inventario
 *    que le den. Lo que este caso impide es que el inventario crezca de una
 *    edición, que es la salida que el propio mensaje de la regla enseña.
 */

const ROOT = resolve(__dirname, '..');
const ESLINT = join(ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js');

test('el gate mide algo: ESLint está instalado y hay config', () => {
  // Sin esto, un `npm ci` que no traiga el linter dejaría el caso de abajo sin
  // nada que correr, y el que lo lea va a creer que corrió limpio.
  assert.ok(existsSync(ESLINT), 'falta `eslint` en devDependencies');
  assert.ok(existsSync(join(ROOT, 'eslint.config.mjs')), 'falta `eslint.config.mjs`');
});

test('`src/` pasa las reglas de ORDEN que este paquete publica', () => {
  let salida;
  try {
    execFileSync(process.execPath, [ESLINT, 'src', '--format', 'stylish'], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    return;
  } catch (error) {
    salida = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  }

  assert.fail(
    'ESLint reporta sobre `src/`. NO agregues el archivo al inventario: esa lista es la ' +
      `foto de la deuda vieja y sólo puede achicarse.\n${salida}`,
  );
});

test('el presupuesto no sube, y baja cuando la deuda baja', () => {
  const archivos = Object.keys(MULTI_EXPORT_INVENTORY).length;
  const simbolos = Object.values(MULTI_EXPORT_INVENTORY).reduce(
    (total, cantidad) => total + cantidad,
    0,
  );

  assert.deepEqual(
    { archivos, simbolos },
    { archivos: MULTI_EXPORT_BUDGET.archivos, simbolos: MULTI_EXPORT_BUDGET.simbolos },
    'NO subas el presupuesto: partí el archivo o mové a su carpeta de eje el símbolo que se ' +
      'sostiene solo. Y si la deuda bajó, bajá el número con ella — el margen acumulado es ' +
      'lugar libre para que vuelva a crecer sin que nada se ponga rojo.',
  );
});
