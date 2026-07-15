export const ChatRoleBadge = {
  CREATOR: 'CREATOR',
  ADMIN: 'ADMIN',
} as const;

export type ChatRoleBadge =
  (typeof ChatRoleBadge)[keyof typeof ChatRoleBadge];
