"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_IMAGE_FORMATS = void 0;
/**
 * Las extensiones de imagen que el servidor acepta.
 *
 * ── POR QUÉ ESTÁ ACÁ Y NO EN EL API ───────────────────────────────────────
 * Su hermana de MIME —`ALLOWED_IMAGE_MIME_TYPES`— ya vivía en este paquete, y
 * de la misma imagen se publicaba la mitad: los MIME sí y las extensiones no.
 * No había una razón escrita en ningún lado para esa mitad; quedó atrás. El
 * costo era concreto: el rechazo de un formato no podía decir cuáles SÍ entran,
 * porque el cliente no tenía la lista y escribirla a mano en tres idiomas es la
 * mentira que `error-copy-numbers-come-from-the-ssot` ya midió treinta veces.
 *
 * ── POR QUÉ NO SE DERIVA DE `ALLOWED_IMAGE_MIME_TYPES` ────────────────────
 * Porque no se puede sin perder `jpg`. `image/jpg` NO es un MIME registrado y
 * está deliberadamente fuera de aquella lista, mientras que `jpg` SÍ es una
 * extensión válida que el explorador de archivos del teléfono muestra todo el
 * tiempo. Las dos listas miden ejes distintos —lo que declara el transporte y
 * lo que dice el nombre del archivo— y por eso son dos.
 */
exports.ALLOWED_IMAGE_FORMATS = [
    'jpeg',
    'jpg',
    'png',
    'webp',
    'heic',
    'heif',
];
