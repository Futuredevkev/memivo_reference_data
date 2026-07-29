import type { ResourceType } from '../../enums';
import type { CloudinaryUploadResourceType } from '../cloudinary-upload-resource-type.type';

export interface UploadIntentFileSignature {
  clientFileId: string;
  fileId: string;
  publicId: string;
  uploadPublicId: string;
  resourceType: CloudinaryUploadResourceType;
  memivoResourceType: ResourceType;
  cloudName: string;
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
