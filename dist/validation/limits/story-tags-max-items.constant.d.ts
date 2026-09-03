/**
 * Cuántas personas se pueden etiquetar en UNA historia.
 *
 * Decide cuántas deja agregar la app Y cuántas acepta el finalize, que es la
 * misma razón por la que su hermano `MULTI_FILE_UPLOAD_LIMIT` vive acá: si los
 * dos números divergen, la persona etiqueta N, espera la subida completa a
 * Cloudinary y recién ahí recibe un 400 — se pierde toda la subida, y el
 * pipeline de fondo descarta el detalle del rechazo a propósito, así que lo que
 * lee es la voz genérica.
 *
 * Eso no era hipotético: el tope existía SÓLO del lado del servidor —una línea
 * `export const` sin docblock, sin publicar— y el flujo de etiquetado de
 * historias no tenía ningún tope, sólo el chequeo de duplicado.
 *
 * ── POR QUÉ 10 ────────────────────────────────────────────────────────────
 * Es el número que el servidor viene aplicando. Una historia es una foto sola y
 * dura una hora: diez personas cubren de sobra la mesa de un evento, y más que
 * eso deja de ser una etiqueta y pasa a ser una lista de difusión.
 */
export declare const STORY_TAGS_MAX_ITEMS = 10;
