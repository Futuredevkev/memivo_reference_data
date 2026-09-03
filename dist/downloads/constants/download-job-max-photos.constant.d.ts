/**
 * Cuántas fotos puede resolver UN trabajo de descarga.
 *
 * Cubre la boda grande (3000-5000) y acota el trabajo por request: pasarlo
 * obliga a partir la selección. Sube al paquete porque el rechazo decía «La
 * selección tiene demasiadas fotos para una sola descarga» sin decir cuántas
 * entran, y el número vivía sólo en el api.
 */
export declare const DOWNLOAD_JOB_MAX_PHOTOS = 5000;
