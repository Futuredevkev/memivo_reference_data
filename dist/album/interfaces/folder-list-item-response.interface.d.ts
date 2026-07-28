import type { CoverPhotoData } from './cover-photo-data.interface';
export interface FolderListItemResponse<TTimestamp = string> {
    id: string;
    name: string;
    position: number;
    photoCount: number;
    cover: CoverPhotoData | null;
    created_at: TTimestamp;
}
