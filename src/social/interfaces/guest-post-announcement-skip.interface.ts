import type { AlbumAnnouncementUnavailableReason } from '../../album/enums/album-announcement-unavailable-reason.enum';

/**
 * Se pidió avisar a todos al publicar y el aviso no salió: la publicación se
 * creó igual, y esto dice por qué no avisó.
 *
 * ── POR QUÉ NO ES UN ERROR ────────────────────────────────────────────────
 * Porque la publicación nunca se pierde por el aviso. Una subida de 40 fotos
 * que se cae porque otro organizador avisó un minuto antes es trabajo perdido;
 * acá se publica y se le cuenta a quien publicó, con la llave del motivo y el
 * instante, para que la app le diga cuándo puede avisar desde el menú.
 */
export interface GuestPostAnnouncementSkip<TTimestamp = string> {
  readonly reason: AlbumAnnouncementUnavailableReason;
  /** Desde cuándo vuelve a poder, o `null` si no depende del reloj. */
  readonly nextAvailableAt: TTimestamp | null;
}
