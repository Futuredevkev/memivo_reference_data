import type { PaginationRequest, SortOrder } from '../../common';
import type { OrganizerAlbumSortField } from '../enums';

export interface GetOrganizerAlbumsQueryRequest extends PaginationRequest {
  sortBy?: OrganizerAlbumSortField;
  direction?: SortOrder;
}
