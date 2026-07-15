import type { OAuthProviderName } from '../enums';
export interface OAuthMethods {
    hasPassword: boolean;
    providers: OAuthProviderName[];
}
