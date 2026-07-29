/**
 * Segmentos de path de los universal links del álbum. **Esto viaja por el
 * cable:** el API acuña `shareUrl` con estos segmentos (`POST /album/invite/...`
 * y los dos previews los devuelven) y el cliente RE-CLASIFICA por ellos —
 * `parseScannedQr` decide a qué endpoint pegarle y el deep-link decide entre
 * redimir e ingresar.
 *
 * Antes vivía escrito a mano en cuatro archivos de dos repos y en ningún
 * contrato. El modo de falla es silencioso y no lo caza ningún gate: renombrar
 * el segmento en el API deja los tres `tsc` en verde y los dos auditores
 * también —miden identidad de símbolos importados, no literales— y el QR se
 * rompe recién en el dispositivo.
 */
export declare const ALBUM_JOIN_PATH_SEGMENT = "join";
export declare const ALBUM_INVITE_PATH_SEGMENT = "invite";
