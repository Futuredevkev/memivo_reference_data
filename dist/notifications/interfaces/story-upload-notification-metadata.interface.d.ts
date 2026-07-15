import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';
export interface StoryUploadNotificationMetadata extends AlbumNotificationMetadata {
    storyId?: string;
}
