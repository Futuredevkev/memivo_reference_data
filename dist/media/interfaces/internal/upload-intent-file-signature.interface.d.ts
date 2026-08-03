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
     * Formatos que el servidor FIRMÓ para este archivo, separados por coma (por
     * ejemplo `'jpeg,jpg,png,webp,heic,heif'`). El cliente lo reenvía tal cual a
     * Cloudinary como `allowed_formats`.
     *
     * No es informativo: viaja DENTRO de la firma, así que mandarlo es
     * obligatorio —omitirlo o cambiarlo invalida la firma entera— y Cloudinary
     * rechaza en el ingress cualquier archivo cuyo formato real no esté en la
     * lista (`400 Image file format X not allowed`), antes de guardar un byte.
     * Es el único tope que Cloudinary sí aplica por request.
     *
     * NO existe un equivalente para el tamaño. Se intentó firmar `max_file_size`
     * (H-267) y no funciona por partida doble: Cloudinary no lo incluye en su
     * string-to-sign —así que la firma quedaba irreproducible y TODA subida moría
     * con 401— ni lo aplica como límite, ni siquiera guardado en un upload
     * preset. Verificado contra la API real. El tamaño se ataja del lado del
     * servidor: el `/complete` mide el asset ya subido y no le cree al cliente.
     */
    allowedFormats: string;
    /**
     * Transformación de INGRESO que el servidor firmó, o `null` cuando no
     * corresponde aplicar ninguna (video y audio: el pipeline de video de
     * Cloudinary falla con transformaciones sincrónicas en archivos grandes).
     *
     * Cuando viene, el cliente la reenvía tal cual como `transformation`; cuando
     * viene `null` NO manda el parámetro. Las dos cosas son obligatorias: viaja
     * dentro de la firma, así que mandarla de más o con otro valor la invalida y
     * Cloudinary responde 401.
     *
     * Es lo que hace que el techo de dimensiones deje de depender de que el
     * cliente recorte antes de subir. Recorta —los presets de imagen van a 1920—
     * pero eso es una promesa de la app, no una garantía de la API.
     */
    transformation: string | null;
}
