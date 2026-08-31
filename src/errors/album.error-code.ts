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
  /**
   * El álbum existe, está entero, y Memivo lo apagó.
   *
   * ── A QUIÉN SE LE DICE, Y POR QUÉ SÓLO A ÉL ───────────────────────────────
   * **Sólo a quien organiza el álbum.** A cualquier otro —miembro o no— la
   * ausencia se le cuenta con la voz colapsada de siempre, que no distingue
   * causas: separar «no existe» de «existe pero no podés verlo» es
   * exactamente el dato que no hay que dar.
   *
   * Con quien organiza no aplica ese motivo: **ya sabe que su álbum existía**,
   * así que decirle la causa no le revela nada de nadie. Y sin este código no
   * hay a dónde mandarlo: el corpus legal promete revisión, y una revisión sin
   * dirección a la que escribir es una promesa sin camino.
   *
   * ── LA TRAMPA, ESCRITA ────────────────────────────────────────────────────
   * Del lado del cliente la tabla de voz de ausencia se llavea por la FORMA del
   * nombre —`…_NOT_FOUND` y `…_EXPIRED`—, así que éste **no entra solo**: hay
   * que anotarlo a mano en la lista de códigos sin forma. Es un techo conocido
   * y está declarado ahí.
   */
  ALBUM_SUSPENDED = 'ALBUM_SUSPENDED',
  PARTICIPANT_NOT_FOUND = 'PARTICIPANT_NOT_FOUND',
}
