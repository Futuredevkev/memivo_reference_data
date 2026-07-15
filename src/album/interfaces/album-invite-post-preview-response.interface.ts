import type { AlbumInviteType } from '../enums';
import type { AlbumInvitePreviewBaseResponse } from './album-invite-preview-base-response.interface';

export interface AlbumInvitePostPreviewResponse
  extends AlbumInvitePreviewBaseResponse {
  type: AlbumInviteType.EXTERNAL_POST_SHARE;
  postId: string;
  authorName: string;
}
