"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_CONTEXT_FILE_LIMITS = void 0;
const validation_1 = require("../../validation");
const enums_1 = require("../enums");
const story_upload_file_limit_constant_1 = require("./story-upload-file-limit.constant");
/**
 * Cuántos archivos acepta CADA contexto de subida.
 *
 * ── POR QUÉ ES TOTAL SOBRE `UPLOAD_INTENT_CONTEXTS` ───────────────────────
 * Porque un contexto sin tope no es un contexto soportado, y las dos cosas ya
 * se decidían en dos lugares: la lista de contextos acá y el reparto de topes
 * del lado del api. Anclado al array publicado, agregar un contexto al intent
 * obliga a escribir su tope en el mismo gesto —falta una entrada y no compila—
 * y no hay forma de que las dos listas discrepen.
 *
 * ── POR QUÉ SUBIÓ AL PAQUETE ──────────────────────────────────────────────
 * El rechazo por cantidad decía «Demasiados archivos seleccionados» sin decir
 * cuántos entran, y no podía: el número vivía sólo en el api. Es la misma clase
 * de defecto que ya se había pagado con el mapa cuando tenía los números
 * TIPEADOS adentro del cuerpo del validador — el docblock del propio contrato
 * dice el costo de que diverjan: la persona elige N, espera la subida completa
 * a Cloudinary y recién ahí recibe un 400.
 */
exports.UPLOAD_CONTEXT_FILE_LIMITS = {
    [enums_1.UploadContext.STORY]: story_upload_file_limit_constant_1.STORY_UPLOAD_FILE_LIMIT,
    [enums_1.UploadContext.GUEST_POST]: validation_1.MULTI_FILE_UPLOAD_LIMIT,
    [enums_1.UploadContext.PROFESSIONAL_PHOTO]: validation_1.ORGANIZER_PHOTO_UPLOAD_LIMIT,
    [enums_1.UploadContext.CHAT_MEDIA]: validation_1.MULTI_FILE_UPLOAD_LIMIT,
};
