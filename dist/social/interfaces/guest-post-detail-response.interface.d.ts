import type { GuestPostResponse } from './guest-post-response.interface';
/**
 * La respuesta del detalle de un guest post, con su álbum garantizado.
 *
 * El feed y el detalle comparten el resto de la forma, pero no esta propiedad:
 * el feed puede omitir `album` y el detalle toma de ahí los permisos del viewer.
 * Reusar sólo `GuestPostResponse` volvía opcional una garantía del endpoint y
 * dejaba que el productor la perdiera sin un error de tipos.
 *
 * El tipo del campo sale por índice del contrato base. Nombrarlo otra vez
 * abriría una segunda declaración que podría divergir cuando cambie el resumen
 * del álbum.
 */
export interface GuestPostDetailResponse<TTimestamp = string> extends GuestPostResponse<TTimestamp> {
    album: NonNullable<GuestPostResponse<TTimestamp>['album']>;
}
