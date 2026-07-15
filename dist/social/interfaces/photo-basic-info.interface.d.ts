import type { PhotoType } from '../enums';
export interface PhotoBasicInfo {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    type: PhotoType;
}
