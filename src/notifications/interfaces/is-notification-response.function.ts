import { NOTIFICATION_TYPE_VALUES } from './internal/notification-type-values.constant';
import type { NotificationTransportResponse } from './notification-transport-response.type';

export const isNotificationResponse = (
  value: unknown,
): value is NotificationTransportResponse => {
  if (!value || typeof value !== 'object') return false;
  return 'id' in value
    && typeof value.id === 'string'
    && 'type' in value
    && typeof value.type === 'string'
    && NOTIFICATION_TYPE_VALUES.has(value.type)
    && 'resourceId' in value
    && typeof value.resourceId === 'string'
    && 'isRead' in value
    && typeof value.isRead === 'boolean'
    && (
      ('created_at' in value && typeof value.created_at === 'string')
      || ('createdAt' in value && typeof value.createdAt === 'string')
    );
};
