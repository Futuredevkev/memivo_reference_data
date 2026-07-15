import { ResourceType } from '../enums';
import { RESOURCE_UPLOAD_LIMITS } from './resource-upload-limits.constant';

export const CHAT_VIDEO_MAX_FILE_SIZE_BYTES =
  RESOURCE_UPLOAD_LIMITS[ResourceType.CHAT_VIDEO].maxFileSize;
