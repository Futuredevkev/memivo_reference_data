export const AlbumMemberRole = {
  OWNER: 'OWNER',
  ORGANIZER: 'ORGANIZER',
  MEMBER: 'MEMBER',
} as const;

export type AlbumMemberRole =
  (typeof AlbumMemberRole)[keyof typeof AlbumMemberRole];
