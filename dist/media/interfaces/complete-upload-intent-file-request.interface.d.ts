import type { CloudinaryUploadResourceType } from './cloudinary-upload-resource-type.type';
export interface CompleteUploadIntentFileRequest {
    publicId: string;
    secureUrl: string;
    resourceType: CloudinaryUploadResourceType;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
    cloudinaryVersion: number;
    cloudinarySignature: string;
    /**
     * Cómo se llamaba el archivo en el teléfono de quien lo mandó.
     *
     * Es la ÚNICA forma de que un documento tenga nombre: el `publicId` que
     * firmamos es un UUID, así que sin esto la burbuja diría «documento» y la
     * descarga se guardaría como `chat-<uuid>.pdf`. Para imagen, video y audio
     * no hace falta y no se manda.
     *
     * Lo declara el cliente y no lo avala nadie, igual que `format` y `bytes` —
     * y a diferencia de esos dos, acá no hay nada que medir contra Cloudinary
     * porque el nombre no existe del otro lado. Es aceptable porque es una
     * ETIQUETA: no participa de ninguna autorización, no elige el pipeline de
     * subida (eso lo decide el MIME en el alta del intent) y el servidor lo
     * sanea antes de usarlo como nombre de descarga.
     */
    originalFilename?: string;
}
