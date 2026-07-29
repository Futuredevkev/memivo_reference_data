/** `/join/<qrCode>` — el link canónico del álbum (QR y «compartir»). */
export declare const buildAlbumJoinPath: (qrCode: string) => string;
/** `/invite/<token>` — el link de invitación de un álbum o de un post. */
export declare const buildAlbumInvitePath: (token: string) => string;
