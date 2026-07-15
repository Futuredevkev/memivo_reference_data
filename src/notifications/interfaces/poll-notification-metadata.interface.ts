import type { ChatGroupNotificationMetadata } from './chat-group-notification-metadata.interface';

export interface PollNotificationMetadata
  extends ChatGroupNotificationMetadata {
  question: string;
}
