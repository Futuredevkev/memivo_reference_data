import type { SessionDevice } from './session-device.interface';

export interface VerifyLoginCodeRequest {
  email: string;
  code: string;
  loginChallengeToken: string;
  device: SessionDevice;
}
