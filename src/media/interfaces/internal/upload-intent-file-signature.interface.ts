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
}
