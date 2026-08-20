import type { CHAT_MESSAGE_CONTENT_BY_TYPE } from '../constants';
import type { ChatContentPayload, ChatMessageType } from '../enums';
/**
 * Los tipos de mensaje que llevan archivos, o sea los que el pipeline de
 * subida puede producir.
 *
 * Es el tipo que anota el `type` del finalize de una subida de chat. Antes ese
 * lugar lo ocupaba `ChatMediaMessageType`, y los dos coincidían por accidente:
 * el día que apareció `DOCUMENT` —archivos sí, galería no— la coincidencia se
 * rompió, y usar el de la galería habría dejado los documentos sin camino de
 * subida.
 */
export type ChatFileBearingMessageType = {
    [K in ChatMessageType]: (typeof CHAT_MESSAGE_CONTENT_BY_TYPE)[K]['payload'] extends ChatContentPayload.FILES ? K : never;
}[ChatMessageType];
