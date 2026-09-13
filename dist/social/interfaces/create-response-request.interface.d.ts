import type { TextOrStickerRequest } from '../../stickers';
/**
 * El alta de una respuesta: el cuerpo de toda alta social, MÁS a qué respuesta
 * del mismo hilo contesta.
 *
 * EXTIENDE `TextOrStickerRequest` y no lo copia: el cuerpo sigue siendo UNO
 * para las altas sociales (ver su docblock, «un solo tipo y no uno por
 * superficie»), y acá sólo se suma lo que es propio de la respuesta. El alta de
 * comentario no tiene nada propio que sumar, y por eso no tiene gemelo: un
 * `CreateCommentRequest` sería el mismo tipo con otro nombre.
 *
 * Es el espejo de `SendTextMessageRequest.replyToMessageId`, la cita del chat.
 */
export interface CreateResponseRequest extends TextOrStickerRequest {
    /**
     * La respuesta del MISMO comentario a la que ésta contesta. Ausente = contesta
     * al comentario.
     *
     * Una respuesta de OTRO comentario y una que ya no existe se rechazan igual,
     * con `RESPONSE_NOT_FOUND`: contestar distinto confirmaría que el id existe en
     * otro hilo. Y es inmutable: editar cambia el texto, no a quién se contesta.
     */
    readonly replyToResponseId?: string;
}
