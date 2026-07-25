import type { AlbumMemberRole } from '../../../album';
import type { HighlightActor } from './highlight-actor.interface';

/**
 * Lo común a todo momento, cualquiera sea su dueño.
 *
 * NO lleva `score`, `peakScore` ni `detectedAt`: el servidor los usa para
 * ordenar, pero como número en pantalla no significan nada — dos momentos de
 * distinto tipo se puntúan con monedas que no son comparables entre sí, así que
 * mostrarlos lado a lado invitaría a una comparación que no es válida.
 *
 * Por eso tampoco es genérico en `TTimestamp`: no le queda ningún campo de
 * fecha (mismo caso que `HighlightUser`).
 */
export interface MemivoMomentBase<TRole extends string = AlbumMemberRole> {
  /** Identidad del MOMENTO (`memivo_moments.id`). Key estable de lista. */
  id: string;
  thumbnailUrl: string | null;
  /** `description` del post | `caption` de la historia. Sustantivo neutro a propósito. */
  caption: string | null;
  user: HighlightActor<TRole>;
}
