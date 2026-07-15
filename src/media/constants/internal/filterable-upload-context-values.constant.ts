import { UploadContext } from '../../enums';

export const FILTERABLE_UPLOAD_CONTEXT_VALUES = [
  UploadContext.GUEST_POST,
  UploadContext.STORY,
  UploadContext.CHAT_MEDIA,
] as const;
