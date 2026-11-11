/**
 * «Ir a una fecha» en un chat: el instante desde el que se quiere leer, en ISO
 * 8601. El servidor contesta con el mensaje ANCLA (ver
 * `ChatMessageAnchorResponse`), y el cliente salta a él por el mismo camino que
 * a cualquier mensaje.
 */
export interface GetMessageAnchorQueryRequest {
    at: string;
}
