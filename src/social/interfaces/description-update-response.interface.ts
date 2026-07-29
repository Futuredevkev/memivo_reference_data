export interface DescriptionUpdateResponse {
  message: string;
  /** `null` cuando la descripción se vació (bloque 36, H-074). */
  description: string | null;
}
