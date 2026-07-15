import type { SessionDevice } from './session-device.interface';
export interface ValidateEmailRequest {
    email: string;
    code: string;
    registrationChallengeToken: string;
    device: SessionDevice;
}
