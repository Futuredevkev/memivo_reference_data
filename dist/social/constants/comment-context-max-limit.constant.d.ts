/**
 * El techo de la ventana del deep-link a comentarios.
 *
 * Existe para que el lookup PUNTUAL no se convierta en otra lectura sin cota:
 * sin techo, un `limit` del cliente decide cuántas filas lee el servidor, y ése
 * es el mismo mecanismo por el que una pantalla de detalle termina costando lo
 * que un listado.
 */
export declare const COMMENT_CONTEXT_MAX_LIMIT = 50;
