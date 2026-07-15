import { ResourceType } from '../enums';
import { RESOURCE_UPLOAD_LIMITS } from './resource-upload-limits.constant';

export const CHAT_AUDIO_MAX_DURATION_MS =
  RESOURCE_UPLOAD_LIMITS[ResourceType.CHAT_AUDIO].maxDurationSeconds! * 1000;
