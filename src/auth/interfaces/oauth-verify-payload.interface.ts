import type { OAuthProviderName } from '../enums';
import type { SessionDevice } from './session-device.interface';

export interface OAuthVerifyPayload {
  provider: OAuthProviderName;
  idToken: string;
  rawNonce?: string;
  device: SessionDevice;
}
