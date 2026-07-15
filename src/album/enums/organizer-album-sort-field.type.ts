import { ORGANIZER_ALBUM_SORT_FIELDS } from './organizer-album-sort-fields.constant';

export type OrganizerAlbumSortField =
  (typeof ORGANIZER_ALBUM_SORT_FIELDS)[number];
