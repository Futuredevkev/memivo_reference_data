import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';
export interface CountedAlbumMetadata extends AlbumNotificationMetadata {
    count: number;
    folderId?: string;
    folderName?: string;
}
