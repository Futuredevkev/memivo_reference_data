import { NotificationType } from '../enums';
import type { NotificationMetadata } from './notification-metadata.type';

/** Payload de push ya renderizado por el backend. */
export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: NotificationMetadata | null;
  isRead: boolean;
  createdAt: string;
}
