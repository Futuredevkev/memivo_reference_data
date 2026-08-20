import type { ChatMediaMessageType } from '../types';
/**
 * Los tipos de mensaje cuyos archivos entran a la GALERÍA de multimedia del
 * chat. DERIVADO del catálogo total, no escrito a mano.
 *
 * Era un array literal con los tres de siempre, y de él colgaba el `WHERE` de
 * `IDX_chat_messages_group_media`: un tipo nuevo con archivos quedaba afuera
 * del índice sin que nada fallara —una consulta que deja de usar índice no se
 * pone roja, se pone lenta—. Derivándolo, el día que alguien agrega un
 * `ChatMessageType` tiene que contestar si entra o no, porque el `Record` no
 * compila sin su entrada (ORDEN §6).
 *
 * Es un subconjunto ESTRICTO de `CHAT_FILE_BEARING_MESSAGE_TYPES`: `DOCUMENT`
 * lleva archivos y no está acá.
 *
 * El predicado del `filter` y el tipo `ChatMediaMessageType` leen el MISMO
 * campo de la MISMA tabla; por eso la firma del guard es una afirmación
 * verificable de un vistazo y no una promesa.
 */
export declare const CHAT_MEDIA_MESSAGE_TYPES: readonly ChatMediaMessageType[];
