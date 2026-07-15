import type { AlbumMemberRole } from '../../../album';
export interface HighlightActor<TRole extends string = AlbumMemberRole> {
    id: string;
    name: string;
    lastName: string;
    avatarUrl?: string;
    albumRole?: TRole;
}
