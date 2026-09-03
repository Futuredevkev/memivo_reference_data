import { ResourceType } from '../enums';
import { ALLOWED_AUDIO_FORMATS } from './allowed-audio-formats.constant';
import { ALLOWED_DOCUMENT_FORMATS } from './allowed-document-formats.constant';
import { ALLOWED_IMAGE_FORMATS } from './allowed-image-formats.constant';
import { ALLOWED_VIDEO_FORMATS } from './allowed-video-formats.constant';
import { MB } from './mb.constant';
import type { PublicResourceUploadLimit } from './internal/public-resource-upload-limit.interface';

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
export const RESOURCE_UPLOAD_LIMITS: Readonly<Record<ResourceType, PublicResourceUploadLimit>> = {
  [ResourceType.AVATAR]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.CHAT_GROUP_AVATAR]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.ALBUM_COVER]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.PROFESSIONAL_PHOTO]: { maxFileSize: 15 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.GUEST_PHOTO]: { maxFileSize: 10 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.GUEST_VIDEO]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 120,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.CHAT_IMAGE]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.CHAT_VIDEO]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 600,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.CHAT_AUDIO]: {
    maxFileSize: 10 * MB,
    maxDurationSeconds: 240,
    formats: ALLOWED_AUDIO_FORMATS,
  },
  // 25 MB, y es EL tope de un documento: los tres lugares que lo aplican —el
  // selector del teléfono, el alta del intent y el `/complete` sobre el asset ya
  // medido— leen esta fila. Sin dueño único, el que se quedó corto rechaza
  // después de subir y el que se quedó largo deja pasar.
  [ResourceType.CHAT_DOCUMENT]: {
    maxFileSize: 25 * MB,
    formats: ALLOWED_DOCUMENT_FORMATS,
  },
  [ResourceType.IMAGE_STORY]: { maxFileSize: 10 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.VIDEO_STORY]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 60,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.PROFILE_REPORT_SCREENSHOT]: {
    maxFileSize: 10 * MB,
    formats: ALLOWED_IMAGE_FORMATS,
  },
};
