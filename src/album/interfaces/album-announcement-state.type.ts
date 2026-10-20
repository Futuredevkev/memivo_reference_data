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
 *
 * ── POR QUÉ UNA UNIÓN Y NO TRES CAMPOS SUELTOS ────────────────────────────
 * Con un objeto plano compilaba `{ canAnnounce: false, unavailableReason:
 * null }`: «no se puede, y no se sabe por qué». Ninguna punta lo producía,
 * pero las dos tenían que defenderse — y la defensa del servidor era una
 * condición `!canAnnounce && unavailableReason !== null` que, ante ese estado,
 * dejaba seguir al reclamo: fallaba ABIERTO. Con la unión el estado no existe
 * en el tipo, `canAnnounce` discrimina, y el motivo y el instante sólo
 * aparecen donde significan algo.
 *
 * `TTimestamp` sigue la convención del repo: `string` (ISO) por el cable,
 * `Date` en la mano del servidor.
 */
export type AlbumAnnouncementState<TTimestamp = string> =
  | {
      /** Puede avisar ahora: no hay motivo ni instante que dibujar. */
      readonly canAnnounce: true;
      readonly unavailableReason: null;
      readonly nextAvailableAt: null;
    }
  | {
      readonly canAnnounce: false;
      /** Por qué no. */
      readonly unavailableReason: AlbumAnnouncementUnavailableReason;
      /**
       * Desde cuándo vuelve a poder, en instante absoluto, o `null` si no
       * depende del reloj (el álbum está oculto, o quien pide no organiza). La
       * app lo compara contra su reloj para volver a habilitar el interruptor
       * sin refrescar; no convierte zonas.
       */
      readonly nextAvailableAt: TTimestamp | null;
    };
