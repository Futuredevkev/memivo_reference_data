/**
 * Códigos de error del módulo de álbumes
 */
export enum AlbumErrorCode {
  ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND',
  ALBUM_PERMISSION_DENIED = 'ALBUM_PERMISSION_DENIED',
  ALBUM_OWNER_REQUIRED = 'ALBUM_OWNER_REQUIRED',
  ALBUM_ORGANIZER_REQUIRED = 'ALBUM_ORGANIZER_REQUIRED',
  ALBUM_INVITE_INVALID = 'ALBUM_INVITE_INVALID',
  ALBUM_INVITE_EXPIRED = 'ALBUM_INVITE_EXPIRED',
  /**
   * El `qrCode` del álbum venció. Es una puerta DISTINTA de
   * `ALBUM_INVITE_EXPIRED` —ésa es el token de invitación— y tiene otro
   * remedio: el invite se vuelve a mandar, el qrCode lo tiene que rotar el
   * organizador. Sin código propio el único emisor posible era el 404 de
   * `ALBUM_NOT_FOUND`, y ahí el cliente no puede distinguir «este código
   * expiró, pedile uno nuevo al organizador» de «este álbum no existe».
   */
  ALBUM_QR_CODE_EXPIRED = 'ALBUM_QR_CODE_EXPIRED',
  ALBUM_OWNER_SCAN_FORBIDDEN = 'ALBUM_OWNER_SCAN_FORBIDDEN',
  ALBUM_PASSWORD_REQUIRED = 'ALBUM_PASSWORD_REQUIRED',
  ALBUM_PASSWORD_INVALID = 'ALBUM_PASSWORD_INVALID',
  ALBUM_NOT_SCANNED = 'ALBUM_NOT_SCANNED',
  PARTICIPANT_NOT_FOUND = 'PARTICIPANT_NOT_FOUND',
}
