import type { ChatMessageType } from '../../chat';
import type { ChatGroupNotificationMetadata } from './chat-group-notification-metadata.interface';

export interface ChatMessageNotificationMetadata
  extends ChatGroupNotificationMetadata {
  content?: string;
  messageId?: string;
  messageType?: ChatMessageType;
  replyToMessageId?: string;
}
