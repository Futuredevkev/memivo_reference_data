import type { RegistrationPayload } from './registration-payload.interface';
import type { SessionDevice } from './session-device.interface';
export interface OAuthCompleteProfilePayload extends Omit<RegistrationPayload, 'email'> {
    onboardingTicket: string;
    device: SessionDevice;
}
