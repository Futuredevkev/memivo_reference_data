import type { AlbumAnnouncementUnavailableReason } from '../enums/album-announcement-unavailable-reason.enum';

/**
 * Lo que el álbum le cuenta a quien lo ORGANIZA sobre si puede avisarle a
 * todos ahora.
 *
 * ── CACHÉ DE CONVENIENCIA, NUNCA AUTORIDAD ────────────────────────────────
 * Mismo contrato que `AlbumPostingState`: sirve para dibujar el
 * interruptor del compositor, su frase y su hora. No autoriza nada. El
 * servidor vuelve a contar el tope bajo lock en cada aviso, y si el estado
 * que la app tiene quedó viejo —otro organizador avisó hace un minuto— la
 * publicación se crea igual y la respuesta dice por qué no avisó.
 *
 * ── A QUIÉN LE LLEGA ──────────────────────────────────────────────────────
 * Sólo a quien organiza. Para el resto, el campo del detalle del álbum vale
 * `null` y el servidor ni siquiera consulta: un invitado no tiene nada que
 * dibujar con esto.
 */
export interface AlbumAnnouncementState<TTimestamp = string> {
  /** ¿Puede avisar ahora? Es exactamente `unavailableReason === null`. */
  readonly canAnnounce: boolean;
  /** Por qué no, o `null` si puede. */
  readonly unavailableReason: AlbumAnnouncementUnavailableReason | null;
  /**
   * Desde cuándo vuelve a poder, en instante absoluto, o `null` si no depende
   * del reloj (el álbum está oculto). La app lo compara contra su reloj para
   * volver a habilitar el interruptor sin refrescar; no convierte zonas.
   */
  readonly nextAvailableAt: TTimestamp | null;
}
