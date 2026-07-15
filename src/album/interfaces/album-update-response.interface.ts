export interface AlbumUpdateResponse {
  message: string;
  album: {
    id: string;
    title: string;
    description: string;
    coverPhoto?: string | null;
    coverPhotoThumbnailUrl?: string | null;
  };
}
