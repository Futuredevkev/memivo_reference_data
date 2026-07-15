import type { UploadIntentContext } from '../types';
import type { CreateUploadIntentFileRequest } from './create-upload-intent-file-request.interface';
import type { FinalizeUploadPayload } from './finalize-upload-payload.type';
export interface CreateUploadIntentRequest {
    context: UploadIntentContext;
    albumId?: string;
    groupId?: string;
    files: CreateUploadIntentFileRequest[];
    payloadHash?: string;
    payload?: FinalizeUploadPayload;
}
