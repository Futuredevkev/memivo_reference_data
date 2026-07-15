import type { SessionDevice } from './session-device.interface';
export interface VerifyTwoFactorLoginRequest {
    userId: string;
    token: string;
    loginChallengeToken: string;
    device: SessionDevice;
}
