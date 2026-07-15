import type { AlbumChatAccessRevokedReason } from '../constants';
export interface AlbumChatAccessRevokedPayload {
    albumId: string;
    groupIds: string[];
    userId: string;
    reason: AlbumChatAccessRevokedReason;
}
