import type { AlbumMemberRole } from '../../album';
import type { GuestPostAlbumSummary } from './guest-post-album-summary.interface';
import type { GuestPostAnnouncement } from './guest-post-announcement.interface';
import type { GuestPostPhoto } from './guest-post-photo.interface';
import type { SocialAuthor } from './social-author.interface';
export interface GuestPostResponse<TTimestamp = string> {
    id: string;
    description: string | null;
    displayAspectRatio: number | null;
    albumId: string;
    user: SocialAuthor & {
        albumRole: AlbumMemberRole;
    };
    photos: GuestPostPhoto<TTimestamp>[];
    likesCount: number;
    commentsCount: number;
    isLikedByUser: boolean;
    /** La marca «Aviso», o `null` si la publicación no avisó. */
    announcement: GuestPostAnnouncement<TTimestamp> | null;
    created_at: TTimestamp;
    album?: GuestPostAlbumSummary;
}
