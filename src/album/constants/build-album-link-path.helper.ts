import {
  ALBUM_INVITE_PATH_SEGMENT,
  ALBUM_JOIN_PATH_SEGMENT,
} from './album-link-paths.constant';

/** `/join/<qrCode>` — el link canónico del álbum (QR y «compartir»). */
export const buildAlbumJoinPath = (qrCode: string): string =>
  `/${ALBUM_JOIN_PATH_SEGMENT}/${qrCode}`;

/** `/invite/<token>` — el link de invitación de un álbum o de un post. */
export const buildAlbumInvitePath = (token: string): string =>
  `/${ALBUM_INVITE_PATH_SEGMENT}/${token}`;
