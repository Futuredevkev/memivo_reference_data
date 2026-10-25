import type { AlbumAnnouncementState } from '../../album/interfaces/album-announcement-state.type';
import type { GuestPostResponse } from './guest-post-response.interface';
/**
 * La respuesta de avisarle a todos con una publicación ya publicada (la
 * puerta del menú del post).
 *
 * Trae las dos cosas que cambiaron: la publicación, ya con su marca, y el
 * estado del aviso del álbum, que acaba de consumir un turno. Con las dos en
 * la respuesta la app corrige el post y apaga el interruptor sin pedir nada
 * más.
 */
export interface GuestPostAnnounceResponse<TTimestamp = string> {
    readonly post: GuestPostResponse<TTimestamp>;
    readonly announcement: AlbumAnnouncementState<TTimestamp>;
}
