import type { TimelinePaginationRequest } from './timeline-pagination-request.interface';

/**
 * Una línea de tiempo que además se puede acotar «de cuánto para acá»: la
 * ventana SEMIABIERTA `[from, before)` sobre el instante de creación.
 *
 * `from` es el borde inferior INCLUSIVO (las ventanas rodantes «últimos 7
 * días»); `before`, el superior exclusivo de «ir a una fecha». Las dos puntas
 * con la misma convención semiabierta, para que dos ventanas contiguas no
 * compartan ni pierdan un instante.
 */
export interface TimelineWindowPaginationRequest extends TimelinePaginationRequest {
  from?: string;
}
