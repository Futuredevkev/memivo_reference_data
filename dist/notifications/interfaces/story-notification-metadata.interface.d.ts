import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';
export interface StoryNotificationMetadata extends AlbumNotificationMetadata {
    storyId: string;
}
