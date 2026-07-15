import type { AlbumMemberRole } from '../../album';

export interface AlbumMemberRoleChangedPayload {
  albumId: string;
  userId: string;
  role: AlbumMemberRole;
  actorId: string;
  isVisible: boolean;
}
