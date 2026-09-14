import type { UserPlanTier } from '../../billing';
import type { AlbumMemberRole } from '../enums';
export interface AlbumGuest<TTimestamp = string> extends UserPlanTier {
    id: string;
    name: string;
    lastName: string;
    avatar: string | null;
    scannedAt: TTimestamp;
    role?: AlbumMemberRole;
    isCreator?: boolean;
    isOrganizer?: boolean;
}
