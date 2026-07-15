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
}
