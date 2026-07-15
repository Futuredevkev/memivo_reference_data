import type { AlbumMemberRole } from '../../album';

export interface GuestPostAlbumSummary {
  id: string;
  title: string;
  creatorId: string;
  currentUserRole?: AlbumMemberRole;
  currentUserCanManage?: boolean;
  currentUserCanManageRoles?: boolean;
  currentUserCanDeleteAlbum?: boolean;
}
