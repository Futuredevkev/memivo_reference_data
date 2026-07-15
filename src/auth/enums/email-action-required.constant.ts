export const EmailActionRequired = {
  SET_PERSONAL_EMAIL: 'SET_PERSONAL_EMAIL',
} as const;

export type EmailActionRequired =
  (typeof EmailActionRequired)[keyof typeof EmailActionRequired];
