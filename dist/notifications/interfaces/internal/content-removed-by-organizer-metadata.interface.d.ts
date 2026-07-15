import type { ModeratedContentType } from '../../../album';
import type { AlbumNotificationMetadata } from '../album-notification-metadata.interface';
export interface ContentRemovedByOrganizerMetadata extends AlbumNotificationMetadata {
    contentType: ModeratedContentType;
}
