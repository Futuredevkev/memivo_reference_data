import type { NotificationResponse } from './notification-response.interface';
export interface NotificationSocketPayload<TTimestamp = string> extends NotificationResponse<TTimestamp> {
    updated_at: TTimestamp;
}
