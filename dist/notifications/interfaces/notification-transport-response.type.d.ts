import type { NormalizeTransportTimestamps } from '../../common';
import type { NotificationResponse } from './notification-response.interface';
export type NotificationTransportResponse = NotificationResponse | NormalizeTransportTimestamps<NotificationResponse>;
