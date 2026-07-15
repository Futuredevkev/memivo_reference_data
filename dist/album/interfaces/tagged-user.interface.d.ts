import type { AlbumMemberRole } from '../enums';
export interface TaggedUser {
    id: string;
    name: string;
    lastName: string;
    avatar: string | null;
    role?: AlbumMemberRole;
}
