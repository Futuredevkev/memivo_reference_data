import type { PhotoNotificationMetadata } from './photo-notification-metadata.interface';

export interface CommentNotificationMetadata
  extends PhotoNotificationMetadata {
  commentId: string;
  responseId?: string;
}
