import type { MentionAnnotation } from '../../mentions';
/**
 * El cuerpo de la EDICIÓN de un texto social: comentario, respuesta o
 * comentario de historia.
 *
 * `mentions` es opcional porque ausente y vacío dicen lo mismo —«este texto no
 * menciona a nadie»—: la edición REEMPLAZA las menciones junto con el texto, y
 * un texto sin ellas las borra. No hay forma de «conservar las de antes» sin
 * mandarlas, porque sus offsets se mueven con el texto.
 */
export interface TextRequest {
    text: string;
    mentions?: MentionAnnotation[];
}
