import { UploadContext } from '../enums';

export const UPLOAD_INTENT_CONTEXTS = [
  UploadContext.STORY,
  UploadContext.GUEST_POST,
  UploadContext.PROFESSIONAL_PHOTO,
  UploadContext.CHAT_MEDIA,
] as const;
