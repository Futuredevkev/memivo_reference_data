import { NotificationType } from '../enums';

export const POST_SUPPRESSION_TYPES = [
  NotificationType.LIKE_PHOTO,
  NotificationType.COMMENT_PHOTO,
  NotificationType.REPLY_COMMENT,
  NotificationType.REACTION_COMMENT,
  NotificationType.REACTION_RESPONSE,
  NotificationType.TAGGED_IN_PHOTO,
] as const;
