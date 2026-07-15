export interface ChatGroupCreatedSocketData {
    id: string;
    name?: string;
    avatarUrl?: string;
    avatarThumbnailUrl?: string | null;
    albumId: string;
    creatorId: string;
}
