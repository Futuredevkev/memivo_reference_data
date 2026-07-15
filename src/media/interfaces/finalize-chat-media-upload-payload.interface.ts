import type { ChatMediaMessageType } from '../../chat/types';

export interface FinalizeChatMediaUploadPayload {
  type: ChatMediaMessageType;
  albumId: string;
  content?: string;
  replyToMessageId?: string;
  viewOnce?: boolean;
}
