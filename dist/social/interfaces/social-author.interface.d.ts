import type { AlbumMemberRole } from '../../album';
import type { SocialUserRole } from './internal/social-user-role.interface';
export interface SocialAuthor {
    id: string;
    name: string;
    lastName: string;
    avatar: {
        url: string;
    } | null;
    albumRole?: AlbumMemberRole;
    roles?: SocialUserRole[];
}
