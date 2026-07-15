import { UploadContext } from '../enums';

/**
 * Contextos de upload que admiten finalize PARCIAL: si algunos archivos del
 * batch fallan, el resto se finaliza igualmente y los pendientes se cancelan.
 * La API lo hace cumplir (finaliza los sobrevivientes + cancela el resto) y el
 * cliente lo anticipa (muestra partial-success con `task.failedFiles`). Ambos
 * lados DEBEN decidir sobre el mismo conjunto; los contextos que NO están acá
 * son atómicos: un fallo aborta el batch entero.
 */
export const UPLOAD_PARTIAL_FINALIZE_CONTEXTS: ReadonlySet<`${UploadContext}`> =
  new Set([UploadContext.PROFESSIONAL_PHOTO]);
