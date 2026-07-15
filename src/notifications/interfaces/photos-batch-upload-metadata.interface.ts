import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';

export interface PhotosBatchUploadMetadata
  extends AlbumNotificationMetadata {
  completedCount?: number;
  failedCount?: number;
  folderId?: string;
  folderName?: string;
}
