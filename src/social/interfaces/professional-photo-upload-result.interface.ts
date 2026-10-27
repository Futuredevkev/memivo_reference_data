import type { ProfessionalPhotoListItem } from './professional-photo-list-item.interface';

export interface ProfessionalPhotoUploadResult<TTimestamp = string> {
  uploadedPhotos: number;
  failedPhotos: number;
  /**
   * Una sola referencia canónica permite revelar el lote sin traer otra página
   * ni devolver todas las fotos. Ausente en servidores anteriores; null si ya
   * no queda ninguna pieza del lote. El replay vuelve a resolverla por los files
   * finalizados, con el mismo mapper y la misma autoridad que la creación.
   */
  createdPhoto?: ProfessionalPhotoListItem<TTimestamp> | null;
}
