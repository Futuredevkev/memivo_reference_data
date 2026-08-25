/**
 * Cuántos stickers recientes conserva una persona.
 *
 * ── POR QUÉ EXISTE UN TOPE ─────────────────────────────────────────────────
 * Porque `user_sticker_usage` crece con cada envío y nada la poda sola. Una
 * tabla sin cota que se escribe en el camino más caliente del chat es una
 * tabla que un día hay que arreglar con la base llena.
 *
 * El recorte lo hace la MISMA escritura que registra el uso: se sube el
 * contador del sticker mandado y se descartan los que caen fuera del tope. No
 * hay cron que barra, y eso es a propósito: un barrido periódico deja ventanas
 * en las que la cota no se cumple.
 *
 * ── Y EL NÚMERO NO SE ESCRIBE DOS VECES ────────────────────────────────────
 * De acá cuelgan el `LIMIT` de la consulta de recientes y la poda de la
 * escritura. Los dos leen esta constante: si el tope viviera en la query y en
 * el borrado por separado, un día la lista devolvería más de lo que la poda
 * conserva —o menos— y nadie se enteraría.
 */
export const STICKER_RECENTS_LIMIT = 32;
