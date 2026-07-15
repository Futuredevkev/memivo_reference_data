export const SessionPlatform = {
  IOS: 'ios',
  ANDROID: 'android',
} as const;

export type SessionPlatform =
  (typeof SessionPlatform)[keyof typeof SessionPlatform];
