import type { CHAT_MESSAGE_CONTENT_BY_TYPE } from '../constants';
import type { ChatMessageType } from '../enums';
/**
 * Los tipos de mensaje cuyos archivos entran a la galería de multimedia.
 *
 * Salía de `(typeof CHAT_MEDIA_MESSAGE_TYPES)[number]`, o sea de un array
 * escrito a mano; ahora sale del catálogo total, así que el compilador lo
 * recalcula solo cuando alguien clasifica un tipo nuevo. El mapeo devuelve
 * `never` para los que no entran y la indexación por `ChatMessageType` colapsa
 * esos `never`, que es la forma estándar de filtrar una unión.
 */
export type ChatMediaMessageType = {
    [K in ChatMessageType]: (typeof CHAT_MESSAGE_CONTENT_BY_TYPE)[K]['inMediaGallery'] extends true ? K : never;
}[ChatMessageType];
