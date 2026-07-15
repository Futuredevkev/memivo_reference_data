import type { AuthTokens } from './auth-tokens.interface';

export interface AuthResponse<TUser> {
  user?: TUser;
  tokens?: AuthTokens;
  message?: string;
  ok?: boolean;
  requires2FA?: boolean;
  userId?: string;
  loginChallengeToken?: string;
  registrationChallengeToken?: string;
}
