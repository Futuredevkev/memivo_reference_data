export const Language = {
  ES: 'es',
  EN: 'en',
  PT: 'pt',
} as const;

export type Language = (typeof Language)[keyof typeof Language];
