import type { AlbumMemberRole } from '../../album';
import type { UserPlanTier } from '../../billing';

export interface HighlightUser<TRole extends string = AlbumMemberRole>
  extends UserPlanTier {
  id: string;
  name: string;
  lastName: string;
  totalInteractions: number;
  avatarUrl?: string;
  albumRole?: TRole;
}
