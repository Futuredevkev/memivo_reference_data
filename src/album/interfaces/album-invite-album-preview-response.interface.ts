import type { AlbumInviteType } from '../enums';
import type { AlbumInvitePreviewBaseResponse } from './album-invite-preview-base-response.interface';

export interface AlbumInviteAlbumPreviewResponse
  extends AlbumInvitePreviewBaseResponse {
  type: AlbumInviteType.EXTERNAL_ALBUM_SHARE;
  postId: null;
  authorName: null;
}
