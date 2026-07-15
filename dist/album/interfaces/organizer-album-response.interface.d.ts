import type { OrganizerAlbumListItemResponse } from './organizer-album-list-item-response.interface';
export interface OrganizerAlbumResponse<TTimestamp = string> {
    message: string;
    album: Omit<OrganizerAlbumListItemResponse<TTimestamp>, 'updated_at'>;
}
