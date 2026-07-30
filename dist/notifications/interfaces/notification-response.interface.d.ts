import { NotificationType } from '../enums';
import type { NotificationActor } from './internal/notification-actor.interface';
import type { NotificationMetadata } from './notification-metadata.type';
export interface NotificationResponse<TTimestamp = string> {
    id: string;
    type: NotificationType;
    resourceId: string;
    isRead: boolean;
    metadata: NotificationMetadata | null;
    created_at: TTimestamp;
    actor?: NotificationActor | null;
}
