import type { AlbumAnnouncementState } from './album-announcement-state.interface';
import type { AlbumListItemResponse } from './album-list-item-response.interface';
import type { AlbumPostingState } from './album-posting-state.interface';

/**
 * El álbum ABIERTO: lo mismo que su tarjeta en la lista, más lo que sólo hace
 * falta adentro.
 *
 * ── POR QUÉ NO SE LE AGREGÓ EL HORARIO A LA TARJETA ───────────────────────
 * Porque la lista no lo dibuja. Metido en la forma compartida, cada tarjeta de
 * cada página arrastraría un dato que nadie lee y la consulta de la lista
 * tendría que proyectar seis columnas más por fila para llenarlo — o dejarlo en
 * `undefined`, que es peor: un campo opcional que el mapper se olvida de
 * resolver compila, desaparece del JSON, y quien lo lee no puede distinguir
 * «no vino» de «está abierto».
 *
 * Extender es lo que deja las dos cosas: el detalle promete el horario SIEMPRE
 * —campo requerido, así que no se puede llenar a medias— y la tarjeta sigue
 * siendo lo chica que era.
 */
export interface AlbumDetailResponse<TTimestamp = string>
  extends AlbumListItemResponse<TTimestamp> {
  readonly posting: AlbumPostingState<TTimestamp>;
  /**
   * Si quien mira puede avisarle a todo el álbum. `null` para quien no
   * organiza: es requerido para que el servidor tenga que decidirlo siempre, y
   * `null` dice «no te toca» sin que nadie lo confunda con «no vino».
   */
  readonly announcement: AlbumAnnouncementState<TTimestamp> | null;
}
