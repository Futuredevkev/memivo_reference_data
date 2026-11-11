import type { PaginationRequest } from './pagination-request.interface';
/**
 * Una línea de tiempo paginada de lo más nuevo a lo más viejo que se puede
 * abrir en un DÍA: «ir a una fecha».
 *
 * `before` es el borde superior EXCLUSIVO sobre el instante de creación, en
 * ISO-8601: la lista arranca en lo último anterior a ese instante y sigue hacia
 * atrás con el cursor de siempre. Para «el 15 de marzo», el cliente manda las
 * 00:00 locales del 16: entra el día entero en la zona de quien elige, y un día
 * sin nada muestra lo más cercano anterior, nunca una lista vacía de mentira.
 *
 * Exclusivo y no inclusivo a propósito: con `<=` sobre «el último milisegundo
 * del día» el borde depende de la precisión con que cada columna guarda el
 * instante; con `<` sobre el comienzo del día siguiente no hay borde que errar.
 *
 * Un solo borde para las listas cronológicas que se abren en un día, con un
 * control compartido para que su precisión y paginación no diverjan.
 */
export interface TimelinePaginationRequest extends PaginationRequest {
    before?: string;
}
