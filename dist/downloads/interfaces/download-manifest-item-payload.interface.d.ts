/**
 * Un archivo firmado dentro de una tanda de descarga.
 *
 * `clientDownloadId` VUELVE, y esta vez con un lector real. Se había sacado
 * junto con `mimeType` porque morían en el mapper que los copia a
 * `DownloadTaskItem` (H-066), y era correcto entonces. Ahora el cliente muestra
 * el progreso de una descarga SOBRE la foto o la carpeta que la originó, y para
 * eso necesita saber qué ítem del manifiesto corresponde a qué objeto suyo.
 *
 * Es un id de CORRELACIÓN, no de dominio: lo genera el cliente en el request y
 * el servidor lo devuelve tal cual. Por eso sirve igual para una foto de álbum
 * que para un archivo de chat, sin que el payload tenga que saber de cuál se
 * trata — y por eso NO se devuelve `photoId`, que obligaría a una segunda forma
 * para el caso de `fileId`.
 *
 * Lo que NO vuelve: `mimeType`, que sigue sin lector; y `sizeBytes`, que era una
 * mentira medible —su ÚNICA escritura era el literal `null`, así que la guarda
 * `item.sizeBytes ? … : null` de los dos productores no podía tomar la rama
 * verdadera nunca (H-065)—. El contrato decía `number | null`, que se lee como
 * «a veces viene el tamaño», y no venía jamás.
 */
export interface DownloadManifestItemPayload {
    id: string;
    /** El id de correlación que mandó el cliente. Ver el docblock de arriba. */
    clientDownloadId: string;
    downloadUrl: string;
    suggestedFilename: string;
}
