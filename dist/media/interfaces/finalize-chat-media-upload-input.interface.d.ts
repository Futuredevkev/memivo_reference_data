import type { FinalizeChatMediaUploadPayload } from './finalize-chat-media-upload-payload.interface';
import type { FinalizeUploadBase } from './internal/finalize-upload-base.interface';
export interface FinalizeChatMediaUploadInput extends FinalizeUploadBase {
    payload: FinalizeChatMediaUploadPayload;
}
