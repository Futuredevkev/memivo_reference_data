/**
 * Archivos por publicación/mensaje. Decide cuántos deja elegir el picker Y
 * cuántos acepta el finalize: si los dos números divergen, la persona elige N,
 * espera la subida completa a Cloudinary y recién ahí recibe un 400 — se pierde
 * toda la subida.
 */
export declare const MULTI_FILE_UPLOAD_LIMIT = 10;
