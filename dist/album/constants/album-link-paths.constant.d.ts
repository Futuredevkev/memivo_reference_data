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
 *
 * ⚠ HAY UN CUARTO CONSUMIDOR QUE NINGÚN AUDITOR MIRA: **`memivo_landing`**.
 *
 * Ese repo SIRVE estos segmentos por HTTP —es donde aterriza el link cuando la
 * persona invitada no tiene la app instalada— y no depende de este paquete: no
 * está en su `package.json`. `scripts/audit-consumers.js` escanea el API y la
 * app, y no lo alcanza.
 *
 * O sea que el peor escenario NO es el que describe el párrafo de arriba. Es
 * éste: se renombra el segmento acá, los tres repos lo adoptan, todo queda en
 * verde… y el link compartido por WhatsApp aterriza en una ruta que el landing
 * ya no sirve. Se descubre en el teléfono de alguien que fue invitado.
 *
 * Mientras el landing no consuma este paquete, su punto de sincronización es
 * `src/lib/appLinkPaths.js`, que existe para eso y cita este archivo. Cualquier
 * cambio de valor acá hay que replicarlo ahí a mano.
 */
export declare const ALBUM_JOIN_PATH_SEGMENT = "join";
export declare const ALBUM_INVITE_PATH_SEGMENT = "invite";
