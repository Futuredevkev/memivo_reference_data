import type { PaginationRequest } from '../../common';

export interface GetGuestPostsQueryRequest extends PaginationRequest {
  taggedUserId?: string;
}
