import type { PaginationRequest } from '../../common';

/**
 * Query de la grilla del Baúl.
 *
 * `search` se hereda de `PaginationRequest` y se IGNORA: lo único buscable sería
 * `caption`, que es opcional, mayormente vacío y sin índice de texto.
 *
 * No existe `to`: el filtro de fechas de la UI son presets rodantes hacia atrás
 * ("últimos 7/30/90/365 días"), así que un límite superior no tendría emisor.
 */
export interface ArchivedStoriesQueryRequest extends PaginationRequest {
  /** Filtra por autor. El scope `albumId` de la ruta es el que autoriza. */
  authorId?: string;
  /** Límite inferior inclusivo sobre `created_at`, ISO-8601. */
  from?: string;
}
