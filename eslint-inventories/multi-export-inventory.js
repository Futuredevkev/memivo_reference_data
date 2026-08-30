/**
 * FOTO EXACTA (archivo → cantidad) de los archivos de `src/` que HOY publican
 * más de un símbolo, el día que este paquete empezó a correr sobre sí mismo la
 * regla que publica.
 *
 * EL NÚMERO LO DA LA REGLA, NO UNA RÉPLICA DE LA REGLA, y la diferencia
 * importa. La medición que abrió el hallazgo replicaba el criterio a mano
 * —«toda declaración exportada de primer nivel»— y contaba 16. Corrida la REGLA
 * DE VERDAD sobre el mismo árbol da bastantes menos: exactamente los de la
 * lista de acá abajo, ni uno más. El idioma `const X` + `type X` —el
 * objeto-como-enum de `AlbumMemberRole`, `Language`, `SessionPlatform`,
 * `SortOrder`, `DownloadContext`, `ChatRoleBadge`, `EmailActionRequired`,
 * `OAuthVerificationIntent`— la regla ya lo cuenta como UN símbolo, que es lo
 * correcto: es un concepto con su valor y su tipo, y por eso ninguno de esos
 * archivos está —ni puede estar— en la lista. Los que quedan son archivos bolsa
 * de verdad. Es el mismo aprendizaje que ya dejó escrito el inventario del
 * cliente: **el oráculo es la regla, no una réplica de la regla.**
 *
 * Y por el mismo motivo la cuenta no se escribe en prosa en ningún lado: el
 * número vive en la lista y en `MULTI_EXPORT_BUDGET`, que es lo que un gate
 * puede leer. Escrito a mano ya se pudrió una vez —este mismo docblock decía
 * «8» y `eslint.config.mjs` decía «16», el mismo día—.
 *
 * Es CommonJS y no ESM a propósito, igual que su hermano del cliente: lo lee
 * `eslint.config.mjs` (ESM) y puede tener que leerlo un gate de `test/`, que
 * corre en `node --test` sobre CommonJS. Es el único formato que los dos
 * resuelven sin configuración extra.
 *
 * NO SE PARTE POR LOTE, Y ACÁ HAY UN MOTIVO QUE NO TIENEN LOS OTROS DOS REPOS:
 * `dist/` se commitea y es lo que el tarball del tag le entrega al api y al
 * cliente. Tocar `src/` obliga a `npm run build` y a commitear el emitido —el
 * gate `dist-matches-src` mide exactamente eso—, así que partir los de la lista
 * es una ola con su propia verificación y su propia publicación. Declarar la
 * deuda medida y cerrarle la puerta a que crezca es lo que corresponde primero.
 *
 * EL NÚMERO ES EXACTO EN LOS DOS SENTIDOS: uno que crece rompe el build, y uno
 * que se achica OBLIGA a bajar la entrada. La lista sólo puede achicarse, así
 * que la deuda no puede quedar declarada de más.
 */
const MULTI_EXPORT_INVENTORY = {
  'src/album/constants/album-link-paths.constant.ts': 2,
  'src/album/constants/album-link-patterns.constant.ts': 2,
  'src/album/constants/build-album-link-path.helper.ts': 2,
  'src/album/constants/folder-name-rules.constant.ts': 3,
  'src/errors/error-code.constant.ts': 2,
  'src/errors/reserved-error-body-keys.constant.ts': 2,
};

/**
 * El techo del inventario, en sus propias cifras y no derivado del objeto.
 *
 * Existe para que agregar un renglón NO sea una edición silenciosa: hay que
 * tocar además estos números. Es el mismo mecanismo que `MULTI_EXPORT_BUDGET`
 * del cliente, y por el mismo motivo — sin él, la receta para volver verde un
 * gate rojo es «agregate a la lista», que es literalmente lo que el mensaje de
 * la regla enseña.
 *
 * Son DOS cifras porque se mueven en direcciones distintas: partir un archivo
 * de tres en tres archivos de uno baja los SÍMBOLOS a cero y saca la entrada;
 * partirlo a medias baja los símbolos sin sacar el archivo.
 *
 * SÓLO PUEDEN BAJAR.
 */
const MULTI_EXPORT_BUDGET = { archivos: 6, simbolos: 13 };

module.exports = { MULTI_EXPORT_INVENTORY, MULTI_EXPORT_BUDGET };
