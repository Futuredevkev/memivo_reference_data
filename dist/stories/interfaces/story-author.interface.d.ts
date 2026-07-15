import type { AlbumMemberRole } from '../../album';
export interface StoryAuthor {
    id: string;
    name: string;
    lastName: string;
    avatarUrl?: string;
    albumRole?: AlbumMemberRole;
}
