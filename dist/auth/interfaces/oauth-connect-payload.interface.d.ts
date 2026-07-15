import type { OAuthProviderName } from '../enums';
import type { AccountReauthCredentials } from './account-reauth-credentials.interface';
export interface OAuthConnectPayload extends AccountReauthCredentials {
    provider: OAuthProviderName;
    idToken: string;
    rawNonce?: string;
}
