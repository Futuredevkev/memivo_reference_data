import type { PaginationRequest } from '../../common';
/**
 * Filtros del registro de actividad del álbum.
 *
 * `action` y `targetUserId` se fueron en el bloque 42 (H-132): la pantalla no
 * tiene chip de tipo de acción ni de destinatario —sólo buscador, filtro por
 * ACTOR y presets de fecha—, así que ningún cliente podía mandarlos. No eran
 * gratis: `album_action_logs` es append-only y crece para siempre, y cada INSERT
 * pagaba los dos índices que sólo esos filtros habrían usado.
 */
export interface AlbumActivityQueryRequest extends PaginationRequest {
    actorId?: string;
    from?: string;
    to?: string;
}
