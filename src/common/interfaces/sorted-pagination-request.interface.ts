import type { PaginationRequest } from './pagination-request.interface';

export interface SortedPaginationRequest extends PaginationRequest {
  direction?: import('../enums').SortOrder;
}
