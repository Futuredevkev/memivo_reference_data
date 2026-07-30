/**
 * Lo que el cliente necesita para subirle UN archivo a Cloudinary por su
 * cuenta: la firma, sus parámetros y a dónde mandarlo. `clientFileId` es lo
 * único que existe para el matching contra la selección local.
 *
 * Se fueron seis campos que el cliente no leía (H-058): `publicId`,
 * `resourceType`, `memivoResourceType`, `cloudName` —el subdominio ya viene
 * dentro de `uploadUrl`— y, el peor, `fileId`. Ése no era sólo peso: era una
 * trampa. Convivía con los `fileIds` de los finalize bajo un nombre casi igual
 * y el MISMO tipo `string`, pero es el id de la fila `upload_intent_files` (que
 * existe desde el momento cero) y no el de un `File` (que recién existe después
 * del complete). Armar `finalizeStory({ fileIds: [intent.files[0].fileId] })`
 * TIPABA PERFECTO y devolvía un 400 «Uploaded files do not match the upload
 * intent» sin la menor pista de cuál era el problema.
 */
export interface UploadIntentFileSignature {
  clientFileId: string;
  uploadPublicId: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
  /**
   * Tope de bytes que el servidor FIRMÓ para este archivo. El cliente lo
   * reenvía tal cual a Cloudinary como `max_file_size`.
   *
   * No es informativo: viaja DENTRO de la firma, así que Cloudinary lo hace
   * cumplir en el ingress y el cliente no lo puede aflojar (un valor distinto
   * invalida la firma entera). Antes se firmaban sólo `timestamp`, `folder` y
   * `public_id`: bytes, format, width, height y duration los declaraba el
   * cliente en el `/complete` y la firma de respuesta de Cloudinary —que cubre
   * `{public_id, version}`— no los avalaba, así que `RESOURCE_UPLOAD_LIMITS`
   * era consultivo y un video de 500 MB podía persistirse como `sizeBytes: 1000`.
   */
  maxFileSize: number;
}
