/**
 * Un archivo firmado dentro de una tanda de descarga.
 *
 * `clientDownloadId` y `mimeType` estaban acá y morían en el mapper que los
 * copia a `DownloadTaskItem`: ninguno tenía una segunda lectura (H-066).
 * `sizeBytes` era además una mentira medible —su ÚNICA escritura era el literal
 * `null`, así que la guarda `item.sizeBytes ? … : null` de los dos productores
 * no podía tomar la rama verdadera nunca (H-065)—. El contrato decía
 * `number | null`, que se lee como «a veces viene el tamaño», y no venía jamás.
 */
export interface DownloadManifestItemPayload {
  id: string;
  downloadUrl: string;
  suggestedFilename: string;
}
