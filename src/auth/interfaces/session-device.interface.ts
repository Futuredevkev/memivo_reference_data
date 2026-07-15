import type { SessionPlatform } from '../enums';

export interface SessionDevice {
  installationId: string;
  platform: SessionPlatform;
  deviceName?: string;
}
