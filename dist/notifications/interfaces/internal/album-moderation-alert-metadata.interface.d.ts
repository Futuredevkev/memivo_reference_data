import type { AlbumActionType } from '../../../album';
import type { AlbumNotificationMetadata } from '../album-notification-metadata.interface';
export interface AlbumModerationAlertMetadata extends AlbumNotificationMetadata {
    action: AlbumActionType;
    count: number;
    actorUserId: string;
}
