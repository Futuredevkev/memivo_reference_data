"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_IMAGE_MIME_TYPES = void 0;
/**
 * MIME types de imagen que el servidor acepta en el borde multipart.
 *
 * Estaba escrito CUATRO veces en dos repos y **dos copias no coincidían**: el
 * filtro de multer no tenía `image/jpg` y la validación posterior sí, mientras
 * el cliente podía generar exactamente ese valor derivándolo de la extensión.
 * El resultado era un rechazo en el borde para un formato que el resto del
 * sistema considera válido. El catálogo hermano de video ya vivía acá.
 *
 * `image/jpg` NO está y es deliberado: no es un MIME válido (el registrado es
 * `image/jpeg`). El productor del cliente ahora lo normaliza en origen, que es
 * donde el error nacía.
 */
exports.ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
];
