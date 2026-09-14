import type { AlbumMemberRole } from '../../album';
import type { UserPlanTier } from '../../billing';

export interface StoryCommentAuthor extends UserPlanTier {
  id: string;
  name: string;
  lastName: string;
  avatar: { url: string } | null;
  albumRole?: AlbumMemberRole;
}
