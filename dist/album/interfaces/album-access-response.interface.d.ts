import type { AlbumAccessResponseAlbum } from './album-access-response-album.interface';
export interface AlbumAccessResponse<TTimestamp = string> {
    message: string;
    album: AlbumAccessResponseAlbum<TTimestamp>;
}
