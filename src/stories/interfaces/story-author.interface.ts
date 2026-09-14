import type { AlbumMemberRole } from '../../album';
import type { UserPlanTier } from '../../billing';

export interface StoryAuthor extends UserPlanTier {
  id: string;
  name: string;
  lastName: string;
  avatarUrl?: string;
  albumRole?: AlbumMemberRole;
}
