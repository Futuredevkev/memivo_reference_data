import { NotificationType } from '../enums';

export const STORY_SUPPRESSION_TYPES = [
  NotificationType.STORY_COMMENT,
  NotificationType.TAGGED_IN_STORY,
] as const;
