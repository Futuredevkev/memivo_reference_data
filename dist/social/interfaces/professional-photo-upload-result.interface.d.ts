import type { FailedUpload } from './failed-upload.interface';
import type { PhotoBasicInfo } from './photo-basic-info.interface';
export interface ProfessionalPhotoUploadResult {
    message: string;
    uploadedPhotos: number;
    failedPhotos: number;
    photos: PhotoBasicInfo[];
    failures: FailedUpload[];
}
