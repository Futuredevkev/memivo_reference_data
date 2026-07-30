import { OAuthVerificationIntent } from '../constants';
import type { AuthTokens } from './auth-tokens.interface';

/**
 * El `user` NO viaja en la rama de sesión (H-029): el cliente ramifica por
 * `tokens` / `requires2FA` / `intent`, guarda los tokens y refresca el perfil
 * con `GET /user/login-user` — `applyOAuthSession` ni siquiera acepta un user.
 * Serializarlo era mandar PII (email, teléfono, cumpleaños, país) sin lector.
 */
export type OAuthVerifyResponse =
  | {
      ok: true;
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
