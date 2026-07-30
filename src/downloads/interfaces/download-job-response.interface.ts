import type { DownloadManifestResponse } from './download-manifest-response.interface';

/**
 * Lo que el cliente necesita para arrancar una descarga por tandas: el id del
 * job (para consultarlo y cancelarlo) y los manifests firmados.
 *
 * `status`, `expiresAt`, `totalCount` y `totalManifests` estaban acá y no los
 * leía nadie (H-066): el tray arma sus `DownloadTask` con estado propio, cuenta
 * los ítems que tiene y toma el vencimiento de CADA manifest —que es el que
 * caduca de verdad, porque las tandas se descargan de a una—.
 */
export interface DownloadJobResponse {
  jobId: string;
  manifests: DownloadManifestResponse[];
}
