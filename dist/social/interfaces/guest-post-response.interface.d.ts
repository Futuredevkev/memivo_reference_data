import type { AlbumMemberRole } from '../../album';
import type { GuestPostAlbumSummary } from './guest-post-album-summary.interface';
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
    /**
     * La marca «Aviso»: quien organiza le avisó a todo el álbum con esta
     * publicación. Es un sí/no y no el instante: viajaba `{ announcedAt }` y
     * ninguna pantalla lo leía (lo encontró `audit:response-fields` antes de
     * cortar `v60.0.0`). Requerido, para que ninguna proyección se olvide de
     * llenarlo.
     */
    isAnnouncement: boolean;
    created_at: TTimestamp;
    album?: GuestPostAlbumSummary;
}
