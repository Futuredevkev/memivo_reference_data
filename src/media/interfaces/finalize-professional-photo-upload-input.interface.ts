import type { FinalizeProfessionalPhotoUploadPayload } from './finalize-professional-photo-upload-payload.interface';
import type { FinalizeUploadBase } from './internal/finalize-upload-base.interface';

export interface FinalizeProfessionalPhotoUploadInput extends FinalizeUploadBase {
  payload: FinalizeProfessionalPhotoUploadPayload;
}
