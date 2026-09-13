import type { ContextWindowMeta } from '../../common';
/**
 * La ventana alrededor de UNA respuesta de un hilo de comentarios.
 *
 * Existe porque las respuestas se paginan de a pocas: el salto a una respuesta
 * —desde un aviso o desde «en respuesta a…»— no podía alcanzar a la que quedaba
 * más allá de la primera página. Es la misma ventana que ya tienen los
 * comentarios y los mensajes, con su objetivo nombrado por dominio como ellas
 * (ver `ContextWindowMeta`).
 */
export interface ResponseContextResponse<TResponse> {
    data: TResponse[];
    targetResponseId: string;
    meta: ContextWindowMeta;
}
