import type { FolderDeletionJobStatus } from '../enums';

/**
 * Durable status returned both when a deletion is queued and while it is
 * polled. Folder deletion is asynchronous because its cost is proportional to
 * the photos contained by the folders, not to the number of folder ids.
 */
export interface DeleteFoldersResponse {
  jobId: string;
  status: FolderDeletionJobStatus;
  totalFolders: number;
  processedFolders: number;
  totalPhotos: number;
  processedPhotos: number;
  error?: string;
}
