import type { AlbumMemberRole } from '../../album';
import type { MemivoPostMoment } from '../interfaces/memivo-post-moment.interface';
import type { MemivoStoryMoment } from '../interfaces/memivo-story-moment.interface';
/**
 * Un ítem de Memivo Moments, discriminado por `type`.
 *
 * Al ser una unión y no un objeto con banderas, un tercer tipo de contenido no
 * compila hasta que alguien atienda su rama en el `switch` del cliente.
 */
export type MemivoMoment<TRole extends string = AlbumMemberRole> = MemivoPostMoment<TRole> | MemivoStoryMoment<TRole>;
