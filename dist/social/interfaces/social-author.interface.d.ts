import type { AlbumMemberRole } from '../../album';
/**
 * El autor de un post, comentario o respuesta, tal como viaja al cliente.
 *
 * NO lleva el rol de PLATAFORMA de la persona, y eso es la decisión que cierra
 * esta interface: `roles` viajaba acá sin que ningún render lo dibujara, y del
 * lado del servidor costaba una query a `users × user_roles × role` por cada
 * página del feed y por cada detalle. Además publicaba la identidad de rol de
 * plataforma de cada autor, que es exactamente lo que ya se había sacado de
 * `AlbumGuest`. El rol que SÍ importa acá es el del ÁLBUM (`albumRole`), que es
 * el que pinta la corona y el escudo.
 */
export interface SocialAuthor {
    id: string;
    name: string;
    lastName: string;
    avatar: {
        url: string;
    } | null;
    albumRole?: AlbumMemberRole;
}
