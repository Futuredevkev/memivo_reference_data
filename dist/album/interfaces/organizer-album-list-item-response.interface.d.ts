import type { AlbumPermissions } from './internal/album-permissions.interface';
export interface OrganizerAlbumListItemResponse<TTimestamp = string> extends AlbumPermissions {
    id: string;
    title: string;
    description: string;
    qrCode: string;
    isVisible: boolean;
    viewCount: number;
    coverPhoto: string | null;
    coverPhotoThumbnailUrl: string | null;
    creatorId: string;
    created_at: TTimestamp;
    updated_at: TTimestamp;
}
