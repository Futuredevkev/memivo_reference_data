/**
 * El largo máximo de un término de búsqueda del catálogo.
 *
 * El borde y el normalizador tienen que compartir este número: si el primero
 * aceptara más de lo que el segundo conserva, dos términos distintos podrían
 * terminar en la misma clave de caché. El tope viene del catálogo, pero la
 * igualdad entre ambas puntas es una regla pública de la request y por eso vive
 * con su contrato.
 */
export declare const STICKER_QUERY_MAX_LENGTH = 50;
