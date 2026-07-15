import type { AlbumMemberRole } from '../../album';
export interface HighlightUser<TRole extends string = AlbumMemberRole> {
    id: string;
    name: string;
    lastName: string;
    totalInteractions: number;
    avatarUrl?: string;
    albumRole?: TRole;
}
