import type { UploadIntentContext } from '../types';
import type { CreateUploadIntentFileRequest } from './create-upload-intent-file-request.interface';
export interface CreateUploadIntentRequest {
    context: UploadIntentContext;
    albumId?: string;
    groupId?: string;
    files: CreateUploadIntentFileRequest[];
}
