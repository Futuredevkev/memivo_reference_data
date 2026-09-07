import { ResourceType } from '../enums';
import { RESOURCE_UPLOAD_LIMITS } from './resource-upload-limits.constant';

/**
 * El tope de duración del video profesional en MILISEGUNDOS, derivado de su
 * fila del catálogo.
 *
 * Existe por lo mismo que sus tres hermanos: el preset del cliente y el recorte
 * nativo trabajan en milisegundos y el catálogo publica segundos. Derivarlo
 * —en vez de escribir el número otra vez— es lo que impide que el recorte del
 * teléfono y el rechazo del servidor hablen de plazos distintos.
 */
export const PROFESSIONAL_VIDEO_MAX_DURATION_MS =
  RESOURCE_UPLOAD_LIMITS[ResourceType.PROFESSIONAL_VIDEO].maxDurationSeconds! *
  1000;
