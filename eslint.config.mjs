import tseslint from 'typescript-eslint';

import memivoOrden from './eslint/index.js';
import inventario from './eslint-inventories/multi-export-inventory.js';

// El inventario es CommonJS —igual que el del cliente, y por el mismo motivo:
// puede tener que leerlo un segundo consumidor que no sea ESM—, así que entra
// por el export default y se desarma acá.
const { MULTI_EXPORT_INVENTORY } = inventario;

/**
 * EL PAQUETE QUE PUBLICA LAS REGLAS DE ORDEN AHORA LAS CORRE SOBRE SÍ MISMO.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `one-exported-symbol-per-file` vive acá —en `eslint/`— y la consumen los dos
 * repos: `memivo_api/eslint.config.mjs` con inventario vacío y
 * `memivo_client/eslint.config.mjs` con su presupuesto. El razonamiento que la
 * mudó acá está escrito en su propio docblock y es correcto: copiarla a cada
 * repo «era exactamente el defecto que la regla existe para impedir».
 *
 * El punto ciego que dejó es que **el paquete quedó afuera de su propio
 * alcance**. Este repo no tenía `eslint.config.mjs` ni `.eslintrc*`, y su
 * `node_modules/.bin` sólo tenía `tsc`: de los tres repos, el único que no
 * corría NINGUNA regla era el que las publica. Y no era teórico: corrida la
 * regla sobre las hojas de `src/`, hay archivos que publican más de un símbolo.
 *
 * ── CUÁNTOS SON NO SE ESCRIBE ACÁ ────────────────────────────────────────
 * Cuáles y cuántos viven en `eslint-inventories/multi-export-inventory.js`: el
 * objeto `MULTI_EXPORT_INVENTORY` (archivo → símbolos) y su presupuesto de dos
 * cifras `MULTI_EXPORT_BUDGET`. No es prosa que haya que creer — la regla
 * reporta también cuando un archivo publica MENOS de lo declarado, y el caso
 * «el presupuesto no sube» de `test/lints-itself.test.js` falla si esas cifras
 * no son las del objeto: el inventario es exacto en los DOS sentidos.
 *
 * Este docblock llegó a repetir la cuenta, y se desincronizó el mismo día en
 * que se escribió: decía dieciséis, que es lo que da REPLICAR EL CRITERIO A
 * MANO. El oráculo es la regla, no una réplica de la regla — y la regla cuenta
 * menos porque deduplica por nombre: el idioma `const X` + `type X` —el
 * objeto-como-enum de `AlbumMemberRole`, `Language`, `SessionPlatform`, …— es
 * UN concepto con su valor y su tipo, y para la regla es UN símbolo. Esos
 * archivos no están en el inventario y no pueden estar, porque no reportan;
 * tampoco necesitan `sanctionedShapes`, que la regla sólo consulta cuando el
 * archivo publica más de uno. La cuenta escrita en dos lugares es la que se
 * pudre: acá va el puntero y nada más — ORDEN, «un solo camino».
 *
 * ── POR QUÉ LA DEUDA NO SE PARTIÓ EN ESTA MISMA PASADA ───────────────────
 * `dist/` se commitea y es lo que el tarball del tag les entrega al api y al
 * cliente, así que tocar `src/` obliga a `npm run build` y a commitear el
 * emitido —el gate `dist-matches-src` mide exactamente eso—. Partir los
 * archivos bolsa que el inventario lista y reconstruir `dist/` es una ola con
 * su propia verificación y su propia publicación; declarar la deuda medida y
 * cerrarle la puerta a que crezca es lo que entra acá.
 *
 * ── ALCANCE, ESCRITO (ORDEN §10) ────────────────────────────────────────
 * Cubre `src/`, que es lo que viaja en el paquete. NO cubre `scripts/` ni
 * `test/`: son CommonJS de Node puro, con otro parser y otras reglas, y
 * meterlos exige antes decidir su bloque — es el mismo hueco de familia que el
 * cliente declaró para sus `scripts/*.cjs`, y no se cierra acá.
 * Tampoco cubre `dist/`: es emitido, y lo mide `dist-matches-src`.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
    },
    plugins: {
      shared: memivoOrden,
    },
    rules: {
      'shared/one-exported-symbol-per-file': ['error', { inventory: MULTI_EXPORT_INVENTORY }],
    },
  },
];
