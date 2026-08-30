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
    /**
     * Cuándo vence el código NUEVO. Nunca es nulo: no existe «sin vencimiento».
     *
     * Viaja acá y no se deja para el próximo refetch porque el reset ya devuelve
     * el `qrCode` nuevo: si la fecha no viniera con él, la pantalla mostraría el
     * código nuevo con el vencimiento viejo hasta que algo la refresque, que es
     * exactamente el estado inconsistente que el reset viene a cerrar.
     */
    qrCodeExpiresAt: string;
}
