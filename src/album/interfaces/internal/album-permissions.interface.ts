import type { AlbumMemberRole } from '../../enums';

export interface AlbumPermissions {
  currentUserRole: AlbumMemberRole;
  currentUserCanManage: boolean;
  currentUserCanManageRoles: boolean;
  currentUserCanDeleteAlbum: boolean;
}
