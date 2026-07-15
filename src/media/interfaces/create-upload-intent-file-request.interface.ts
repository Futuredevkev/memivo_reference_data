import type { MediaFilterId } from '../types';

export interface CreateUploadIntentFileRequest {
  clientFileId: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  filterId?: MediaFilterId;
}
