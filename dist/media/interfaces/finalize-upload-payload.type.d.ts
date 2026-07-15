import type { FinalizeChatMediaUploadPayload } from './finalize-chat-media-upload-payload.interface';
import type { FinalizeGuestPostUploadPayload } from './finalize-guest-post-upload-payload.interface';
import type { FinalizeProfessionalPhotoUploadPayload } from './finalize-professional-photo-upload-payload.interface';
import type { FinalizeStoryUploadPayload } from './finalize-story-upload-payload.interface';
export type FinalizeUploadPayload = FinalizeGuestPostUploadPayload | FinalizeStoryUploadPayload | FinalizeProfessionalPhotoUploadPayload | FinalizeChatMediaUploadPayload;
