import type { FinalizeGuestPostUploadPayload } from './finalize-guest-post-upload-payload.interface';
import type { FinalizeUploadBase } from './internal/finalize-upload-base.interface';
export interface FinalizeGuestPostUploadInput extends FinalizeUploadBase {
    payload?: FinalizeGuestPostUploadPayload;
}
