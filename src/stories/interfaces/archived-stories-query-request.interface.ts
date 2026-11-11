import type { TimelineWindowPaginationRequest } from '../../common';

/**
 * Query de la grilla del Baúl.
 *
 * `search` se hereda de `PaginationRequest` y se IGNORA: lo único buscable sería
 * `caption`, que es opcional, mayormente vacío y sin índice de texto.
 *
 * La fecha es la ventana de toda línea de tiempo
 * (`TimelineWindowPaginationRequest`): los presets rodantes («últimos 7/30/90/
 * 365 días») por `from`, e «ir a una fecha» por `before`.
 */
export interface ArchivedStoriesQueryRequest extends TimelineWindowPaginationRequest {
  /** Filtra por autor. El scope `albumId` de la ruta es el que autoriza. */
  authorId?: string;
  /**
   * Filtra por persona ETIQUETADA en la historia. Es OTRO eje que `authorId`,
   * no el mismo con otro nombre: se puede aparecer en el Baúl sin haber subido
   * nada, y los dos filtros se combinan con `AND`.
   *
   * Se llama igual que el del feed de invitados —el eje es el mismo— para que
   * el cliente no tenga dos nombres para la misma pregunta.
   */
  taggedUserId?: string;
}
