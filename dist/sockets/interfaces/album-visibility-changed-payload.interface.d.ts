export interface AlbumVisibilityChangedPayload {
    albumId: string;
    isVisible: boolean;
    accessRevoked?: boolean;
}
