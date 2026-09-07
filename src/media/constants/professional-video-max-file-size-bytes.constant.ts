import { ResourceType } from '../enums';
import { RESOURCE_UPLOAD_LIMITS } from './resource-upload-limits.constant';

/**
 * El tope de peso del video profesional, derivado de su fila del catálogo.
 *
 * Lo lee el preset del cliente, que es quien decide si el archivo elegido hay
 * que recomprimirlo antes de subir. Sin derivarlo, el teléfono podría comprimir
 * contra un techo distinto del que el servidor rechaza, y la persona esperaría
 * la compresión entera para recibir un 400.
 */
export const PROFESSIONAL_VIDEO_MAX_FILE_SIZE_BYTES =
  RESOURCE_UPLOAD_LIMITS[ResourceType.PROFESSIONAL_VIDEO].maxFileSize;
