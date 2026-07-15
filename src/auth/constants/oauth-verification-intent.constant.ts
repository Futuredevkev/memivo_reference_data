export const OAuthVerificationIntent = {
  STEPUP_LINK: 'STEPUP_LINK',
  SIGNUP: 'SIGNUP',
} as const;

export type OAuthVerificationIntent =
  (typeof OAuthVerificationIntent)[keyof typeof OAuthVerificationIntent];
