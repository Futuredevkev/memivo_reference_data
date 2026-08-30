/**
 * El plugin de ESLint con las reglas de ORDEN que gobiernan LOS DOS repos.
 *
 * Se consume desde el paquete instalado (`@memivo/contracts/eslint`) y no por
 * ruta relativa al checkout hermano, que es como se consumen los auditores de
 * `scripts/`: un `eslint.config.mjs` que importara `../memivo-reference-data`
 * se caería en cualquier máquina donde sólo esté clonado un repo —CI, EAS—, y
 * un gate que no puede correr no es un gate.
 *
 * Una regla entra acá cuando la convención que hace cumplir está escrita en
 * `ORDEN.md`, o sea cuando vale para los dos repos. Las reglas que dependen de
 * la superficie de UN repo —las cuatro `memivo/*` visuales del cliente, el join
 * crudo a `user` del API— se quedan en su repo: no tienen segunda copia posible
 * porque no tienen segundo consumidor.
 */
const oneExportedSymbolPerFile = require('./one-exported-symbol-per-file');

module.exports = {
  rules: {
    'one-exported-symbol-per-file': oneExportedSymbolPerFile,
  },
};
