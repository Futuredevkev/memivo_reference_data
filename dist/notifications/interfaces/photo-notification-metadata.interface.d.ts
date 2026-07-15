import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';
export interface PhotoNotificationMetadata extends AlbumNotificationMetadata {
    guestPostId: string;
}
