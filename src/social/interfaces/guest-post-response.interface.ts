import type { AlbumMemberRole } from '../../album';
import type { GuestPostAlbumSummary } from './guest-post-album-summary.interface';
import type { GuestPostPhoto } from './guest-post-photo.interface';
import type { SocialAuthor } from './social-author.interface';
import type { SocialUserRole } from './internal/social-user-role.interface';

export interface GuestPostResponse<TTimestamp = string> {
  id: string;
  description: string | null;
  displayAspectRatio: number | null;
  userId: string;
  albumId: string;
  user: SocialAuthor & { albumRole: AlbumMemberRole; roles: SocialUserRole[] };
  photos: GuestPostPhoto<TTimestamp>[];
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  created_at: TTimestamp;
  updated_at: TTimestamp;
  album?: GuestPostAlbumSummary;
}
