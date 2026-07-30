/**
 * Resultado de rotar el acceso por link de un álbum.
 *
 * Un álbum tiene DOS puertas: el `qrCode` permanente y el invite-link que
 * reparte «compartir». Esta operación cierra las dos de una — cerrar sólo una
 * no cierra nada, porque quien quiere volver a entrar usa la que tenga a mano.
 *
 * No afecta a los miembros actuales: invalida invitaciones pendientes, no
 * membresías ya concedidas.
 */
export interface AlbumAccessResetResponse {
  albumId: string;
  /** El código nuevo. El anterior deja de resolver. */
  qrCode: string;
  /** URL universal `/join/:qrCode` ya armada, para compartir o pintar el QR. */
  joinUrl: string;
}
