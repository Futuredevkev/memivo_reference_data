"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_AUDIO_FORMATS = void 0;
/**
 * Las extensiones de audio que el servidor acepta para una nota de voz.
 *
 * Sube acá por el mismo motivo que `ALLOWED_IMAGE_FORMATS`: el rechazo de un
 * formato tiene que poder nombrar los que sí entran, y el cliente no tenía la
 * lista. De las cuatro familias de media, dos ya se publicaban —video y
 * documento— y dos no; era la misma clase de valor con dos formas.
 *
 * `mp4` está a propósito y no es un error de copiar y pegar: es el contenedor
 * que graban los dos teléfonos para audio (AAC dentro de MP4), y Cloudinary lo
 * ingesta por su pipeline de video igual que el resto de esta lista.
 */
exports.ALLOWED_AUDIO_FORMATS = [
    'mp3',
    'wav',
    'm4a',
    'aac',
    'ogg',
    'mp4',
    '3gp',
    'amr',
    'caf',
];
