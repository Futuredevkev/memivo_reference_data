import type { TimelineWindowPaginationRequest } from '../../common';
/**
 * Filtros del registro de actividad del álbum: buscador, ACTOR y la ventana de
 * fechas de toda línea de tiempo (`TimelineWindowPaginationRequest`: los
 * presets rodantes por `from` e «ir a una fecha» por `before`).
 *
 * `action` y `targetUserId` se fueron en el bloque 42 (H-132): la pantalla no
 * tiene chip de tipo de acción ni de destinatario, así que ningún cliente podía
 * mandarlos. No eran gratis: `album_action_logs` es append-only y crece para
 * siempre, y cada INSERT pagaba los dos índices que sólo esos filtros habrían
 * usado.
 *
 * Tenía un `to` inclusivo propio que ningún cliente mandaba; el borde superior
 * es ahora el `before` exclusivo que comparten todas las líneas de tiempo.
 */
export interface AlbumActivityQueryRequest extends TimelineWindowPaginationRequest {
    actorId?: string;
}
