import type { AlbumMemberRole } from '../../album';
export interface StoryCommentAuthor {
    id: string;
    name: string;
    lastName: string;
    avatar: {
        url: string;
    } | null;
    albumRole?: AlbumMemberRole;
}
