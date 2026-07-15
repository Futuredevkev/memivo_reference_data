import type { PaginationRequest, SortOrder } from '../../common';
import type { AlbumSortField } from '../enums';

export interface GetAlbumsQueryRequest extends PaginationRequest {
  sortBy?: AlbumSortField;
  direction?: SortOrder;
}
