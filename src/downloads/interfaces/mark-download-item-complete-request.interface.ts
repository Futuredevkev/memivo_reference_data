import type { MarkDownloadItemCompleteStatus } from './mark-download-item-complete-status.type';

export interface MarkDownloadItemCompleteRequest {
  status: MarkDownloadItemCompleteStatus;
  failureReason?: string;
}
