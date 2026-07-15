import type { UploadIntentFileSignature } from './internal/upload-intent-file-signature.interface';

export interface UploadIntentResponse {
  uploadId: string;
  expiresAt: string;
  files: UploadIntentFileSignature[];
}
