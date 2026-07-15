import type { ReactionType } from '../../reactions';
import type { PhotoNotificationMetadata } from './photo-notification-metadata.interface';

export interface ReactionOnPhotoMetadata
  extends PhotoNotificationMetadata {
  commentId?: string;
  responseId?: string;
  reactionType: `${ReactionType}`;
}
