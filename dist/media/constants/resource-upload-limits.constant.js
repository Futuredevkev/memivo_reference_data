"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_UPLOAD_LIMITS = void 0;
const enums_1 = require("../enums");
const allowed_audio_formats_constant_1 = require("./allowed-audio-formats.constant");
const allowed_document_formats_constant_1 = require("./allowed-document-formats.constant");
const allowed_image_formats_constant_1 = require("./allowed-image-formats.constant");
const allowed_video_formats_constant_1 = require("./allowed-video-formats.constant");
const mb_constant_1 = require("./mb.constant");
/**
 * Todo lo que un tipo de recurso acota al subirse: cuánto puede pesar, cuánto
 * puede durar y qué extensiones acepta.
 *
 * ── POR QUÉ EL FORMATO ENTRÓ A ESTA TABLA (y no a una hermana) ─────────────
 * El reparto tipo → lista vivía en `RESOURCE_CONFIG`, del lado del api, así que
 * el cliente podía decir el PESO que un recurso admite y no los FORMATOS. El
 * mensaje de «formato no soportado» quedaba sin poder nombrar los que sí
 * entran, que es exactamente la clase de defecto que esta ola vino a cerrar:
 * anunciar una regla sin decirla. Publicarlo como tabla APARTE habría dejado
 * dos filas por recurso en dos archivos, y una fila nueva podría declarar el
 * peso y olvidarse del formato sin que nada se pusiera rojo. Acá el tipo lo
 * impide.
 */
exports.RESOURCE_UPLOAD_LIMITS = {
    [enums_1.ResourceType.AVATAR]: { maxFileSize: 5 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.CHAT_GROUP_AVATAR]: { maxFileSize: 5 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.ALBUM_COVER]: { maxFileSize: 5 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.PROFESSIONAL_PHOTO]: { maxFileSize: 15 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.GUEST_PHOTO]: { maxFileSize: 10 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.GUEST_VIDEO]: {
        maxFileSize: 100 * mb_constant_1.MB,
        maxDurationSeconds: 120,
        formats: allowed_video_formats_constant_1.ALLOWED_VIDEO_FORMATS,
    },
    [enums_1.ResourceType.CHAT_IMAGE]: { maxFileSize: 5 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.CHAT_VIDEO]: {
        maxFileSize: 100 * mb_constant_1.MB,
        maxDurationSeconds: 600,
        formats: allowed_video_formats_constant_1.ALLOWED_VIDEO_FORMATS,
    },
    [enums_1.ResourceType.CHAT_AUDIO]: {
        maxFileSize: 10 * mb_constant_1.MB,
        maxDurationSeconds: 240,
        formats: allowed_audio_formats_constant_1.ALLOWED_AUDIO_FORMATS,
    },
    // 25 MB, y es EL tope de un documento: los tres lugares que lo aplican —el
    // selector del teléfono, el alta del intent y el `/complete` sobre el asset ya
    // medido— leen esta fila. Sin dueño único, el que se quedó corto rechaza
    // después de subir y el que se quedó largo deja pasar.
    [enums_1.ResourceType.CHAT_DOCUMENT]: {
        maxFileSize: 25 * mb_constant_1.MB,
        formats: allowed_document_formats_constant_1.ALLOWED_DOCUMENT_FORMATS,
    },
    [enums_1.ResourceType.IMAGE_STORY]: { maxFileSize: 10 * mb_constant_1.MB, formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS },
    [enums_1.ResourceType.VIDEO_STORY]: {
        maxFileSize: 100 * mb_constant_1.MB,
        maxDurationSeconds: 60,
        formats: allowed_video_formats_constant_1.ALLOWED_VIDEO_FORMATS,
    },
    [enums_1.ResourceType.PROFILE_REPORT_SCREENSHOT]: {
        maxFileSize: 10 * mb_constant_1.MB,
        formats: allowed_image_formats_constant_1.ALLOWED_IMAGE_FORMATS,
    },
};
