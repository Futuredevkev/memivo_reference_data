import type { AlbumAccessResponseAlbum } from './album-access-response-album.interface';
export interface AlbumInviteRedeemResponse<TTimestamp = string> {
    message: string;
    alreadyJoined: boolean;
    postId: string | null;
    album: AlbumAccessResponseAlbum<TTimestamp>;
}
