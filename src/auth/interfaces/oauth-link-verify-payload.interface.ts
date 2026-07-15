import type { OAuthConnectPayload } from './oauth-connect-payload.interface';
import type { SessionDevice } from './session-device.interface';

export interface OAuthLinkVerifyPayload extends OAuthConnectPayload {
  oauthLinkChallengeToken: string;
  device: SessionDevice;
}
