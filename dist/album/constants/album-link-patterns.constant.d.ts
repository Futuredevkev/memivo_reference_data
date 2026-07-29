/**
 * Los patrones con los que el consumidor re-clasifica una URL acuñada por el
 * API. Se derivan de los mismos segmentos que la construyen: si el segmento
 * cambia, el parser cambia con él en vez de quedar desfasado en silencio.
 */
export declare const ALBUM_JOIN_URL_PATTERN: RegExp;
export declare const ALBUM_INVITE_URL_PATTERN: RegExp;
