import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';

export interface PhotoUploadNotificationMetadata
  extends AlbumNotificationMetadata {
  guestPostId?: string;
}
