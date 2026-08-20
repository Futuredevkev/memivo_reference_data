import { ResourceType } from '../enums';
import { MB } from './mb.constant';
import type { PublicResourceUploadLimit } from './internal/public-resource-upload-limit.interface';

export const RESOURCE_UPLOAD_LIMITS: Readonly<Record<ResourceType, PublicResourceUploadLimit>> = {
  [ResourceType.AVATAR]: { maxFileSize: 5 * MB },
  [ResourceType.CHAT_GROUP_AVATAR]: { maxFileSize: 5 * MB },
  [ResourceType.ALBUM_COVER]: { maxFileSize: 5 * MB },
  [ResourceType.PROFESSIONAL_PHOTO]: { maxFileSize: 15 * MB },
  [ResourceType.GUEST_PHOTO]: { maxFileSize: 10 * MB },
  [ResourceType.GUEST_VIDEO]: { maxFileSize: 100 * MB, maxDurationSeconds: 120 },
  [ResourceType.CHAT_IMAGE]: { maxFileSize: 5 * MB },
  [ResourceType.CHAT_VIDEO]: { maxFileSize: 100 * MB, maxDurationSeconds: 600 },
  [ResourceType.CHAT_AUDIO]: { maxFileSize: 10 * MB, maxDurationSeconds: 240 },
  // 25 MB, y es EL tope de un documento: los tres lugares que lo aplican —el
  // selector del teléfono, el alta del intent y el `/complete` sobre el asset ya
  // medido— leen esta fila. Sin dueño único, el que se quedó corto rechaza
  // después de subir y el que se quedó largo deja pasar.
  [ResourceType.CHAT_DOCUMENT]: { maxFileSize: 25 * MB },
  [ResourceType.IMAGE_STORY]: { maxFileSize: 10 * MB },
  [ResourceType.VIDEO_STORY]: { maxFileSize: 100 * MB, maxDurationSeconds: 60 },
  [ResourceType.PROFILE_REPORT_SCREENSHOT]: { maxFileSize: 10 * MB },
};
