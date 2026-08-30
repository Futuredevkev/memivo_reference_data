/**
 * Compartir un post en un grupo de chat.
 *
 * `clientTempId` es la clave de deduplicación que este camino era el ÚNICO de
 * alta de mensaje en no tener. El `catch` del cliente reporta el fallo DESPUÉS
 * de que el INSERT ya ocurrió —un timeout de red, por ejemplo— o sea que invita
 * al reintento, y el reintento duplicaba la burbuja y la push. El índice único
 * parcial sobre `(chatGroupId, senderId, clientTempId)` ya existe en la base: lo
 * que faltaba era que el campo llegara.
 *
 * Opcional como en `SendTextMessageRequest`, que es el hermano de este mismo
 * directorio: el servidor no puede exigir lo que un cliente viejo no manda, y
 * sin el campo el alta sigue funcionando —simplemente sin protección de
 * reintento, que es la conducta que ya había—.
 */
export interface SendSharedPostMessageRequest {
    albumId: string;
    postId: string;
    clientTempId?: string;
    caption?: string;
    replyToMessageId?: string;
}
