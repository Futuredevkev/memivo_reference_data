import type { FinalizeStoryUploadPayload } from './finalize-story-upload-payload.interface';
import type { FinalizeUploadBase } from './internal/finalize-upload-base.interface';

export interface FinalizeStoryUploadInput extends FinalizeUploadBase {
  payload?: FinalizeStoryUploadPayload;
}
