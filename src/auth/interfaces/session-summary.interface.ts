import type { SessionPlatform } from '../enums';

export interface SessionSummary<TTimestamp = string> {
  id: string;
  platform: SessionPlatform;
  deviceName: string | null;
  lastUsedAt: TTimestamp;
  createdAt: TTimestamp;
  isCurrent: boolean;
}
