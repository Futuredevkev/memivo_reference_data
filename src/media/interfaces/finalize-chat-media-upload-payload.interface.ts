import type { ChatFileBearingMessageType } from '../../chat/types';

export interface FinalizeChatMediaUploadPayload {
  /**
   * Los tipos que LLEVAN ARCHIVOS, no los de la galería.
   *
   * Eran el mismo conjunto hasta que apareció `DOCUMENT` —archivos sí,
   * miniatura no—, y anotar esto con el de la galería habría dejado los
   * documentos sin camino de subida con un `400` que no explica nada.
   */
  type: ChatFileBearingMessageType;
  albumId: string;
  content?: string;
  replyToMessageId?: string;
  viewOnce?: boolean;
}
