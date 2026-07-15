/**
 * Códigos de error del login social (Google / Apple).
 */
export enum OAuthErrorCode {
  // Verificación del id_token del provider
  OAUTH_TOKEN_INVALID = 'OAUTH_TOKEN_INVALID',
  OAUTH_PROVIDER_UNAVAILABLE = 'OAUTH_PROVIDER_UNAVAILABLE',
  OAUTH_VERIFICATION_FAILED = 'OAUTH_VERIFICATION_FAILED',
  OAUTH_EMAIL_NOT_VERIFIED = 'OAUTH_EMAIL_NOT_VERIFIED',

  // Resolución / linking de cuenta
  // (provider, subject) ya vinculado a OTRA cuenta (case X).
  OAUTH_IDENTITY_ALREADY_LINKED = 'OAUTH_IDENTITY_ALREADY_LINKED',
  // El usuario YA tiene ese provider conectado a su PROPIA cuenta (colisión de
  // UNIQUE(userId, provider), no de (provider, subject)). Mensaje distinto.
  OAUTH_PROVIDER_ALREADY_CONNECTED = 'OAUTH_PROVIDER_ALREADY_CONNECTED',
  OAUTH_IDENTITY_NOT_FOUND = 'OAUTH_IDENTITY_NOT_FOUND',
  OAUTH_CANNOT_REMOVE_ONLY_METHOD = 'OAUTH_CANNOT_REMOVE_ONLY_METHOD',

  // Onboarding ticket (signup incompleto)
  OAUTH_ONBOARDING_TICKET_INVALID = 'OAUTH_ONBOARDING_TICKET_INVALID',
  OAUTH_ONBOARDING_TICKET_EXPIRED = 'OAUTH_ONBOARDING_TICKET_EXPIRED',

  // Server-to-server notifications de Apple
  OAUTH_APPLE_NOTIFICATION_INVALID = 'OAUTH_APPLE_NOTIFICATION_INVALID',
}
