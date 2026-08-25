import type { StickerReference } from './sticker-reference.interface';
/**
 * Lo que el proxy del catálogo devuelve.
 *
 * `nextCursor` es OPACO y `null` cuando no hay más. La paginación la hace el
 * SERVIDOR contra el proveedor: no se baja un lote grande para cortarlo en el
 * teléfono, que es lo que ORDEN §8 prohíbe («nunca drenar para filtrar en
 * memoria»).
 */
export interface StickerSearchResponse {
    readonly items: readonly StickerReference[];
    readonly nextCursor: string | null;
}
