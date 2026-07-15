export interface AlbumStats<TTimestamp = string> {
    albumId: string;
    title: string;
    totalParticipants: number;
    postCount: number;
    professionalPhotoCount: number;
    chatGroupCount: number;
    professionalPhotosDownloaded: number;
    foldersDownloaded: number;
    isActive: boolean;
    created_at: TTimestamp;
}
