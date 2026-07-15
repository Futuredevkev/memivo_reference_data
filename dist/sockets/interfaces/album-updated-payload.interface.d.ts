export interface AlbumUpdatedPayload {
    albumId: string;
    title?: string;
    description?: string;
    coverPhoto?: string;
    coverPhotoThumbnailUrl?: string | null;
}
