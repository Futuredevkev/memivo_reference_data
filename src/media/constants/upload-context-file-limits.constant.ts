import { MULTI_FILE_UPLOAD_LIMIT, ORGANIZER_PHOTO_UPLOAD_LIMIT } from '../../validation';
import { UploadContext } from '../enums';
import { STORY_UPLOAD_FILE_LIMIT } from './story-upload-file-limit.constant';
import { UPLOAD_INTENT_CONTEXTS } from './upload-intent-contexts.constant';

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
export const UPLOAD_CONTEXT_FILE_LIMITS: Readonly<
  Record<(typeof UPLOAD_INTENT_CONTEXTS)[number], number>
> = {
  [UploadContext.STORY]: STORY_UPLOAD_FILE_LIMIT,
  [UploadContext.GUEST_POST]: MULTI_FILE_UPLOAD_LIMIT,
  [UploadContext.PROFESSIONAL_PHOTO]: ORGANIZER_PHOTO_UPLOAD_LIMIT,
  [UploadContext.CHAT_MEDIA]: MULTI_FILE_UPLOAD_LIMIT,
};
