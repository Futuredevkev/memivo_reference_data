import type { AlbumMemberRole } from '../../../album';
import type { UserPlanTier } from '../../../billing';

export interface HighlightActor<TRole extends string = AlbumMemberRole>
  extends UserPlanTier {
  id: string;
  name: string;
  lastName: string;
  avatarUrl?: string;
  albumRole?: TRole;
}
