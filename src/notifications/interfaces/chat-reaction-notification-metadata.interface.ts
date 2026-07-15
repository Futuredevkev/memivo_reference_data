import type { ChatReactionType } from '../../chat';
import type { ChatGroupNotificationMetadata } from './chat-group-notification-metadata.interface';

export interface ChatReactionNotificationMetadata
  extends ChatGroupNotificationMetadata {
  messageId: string;
  reactionType: `${ChatReactionType}`;
}
