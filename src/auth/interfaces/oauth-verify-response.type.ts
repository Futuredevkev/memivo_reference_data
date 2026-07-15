import { OAuthVerificationIntent } from '../constants';
import type { AuthTokens } from './auth-tokens.interface';

export type OAuthVerifyResponse<TUser> =
  | {
      ok: true;
      user: TUser;
      tokens: AuthTokens;
    }
  | {
      ok: true;
      requires2FA: true;
      userId: string;
      loginChallengeToken: string;
    }
  | {
      ok: true;
      intent: typeof OAuthVerificationIntent.STEPUP_LINK;
      oauthLinkChallengeToken: string;
      email: string;
    }
  | {
      ok: true;
      intent: typeof OAuthVerificationIntent.SIGNUP;
      onboardingTicket: string;
      prefill: {
        name: string | null;
        lastName: string | null;
        email: string | null;
      };
    };
