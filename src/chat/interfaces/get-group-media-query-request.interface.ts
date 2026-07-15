import type { PaginationRequest } from '../../common';
import type { ChatMessageType } from '../enums';

export interface GetGroupMediaQueryRequest extends PaginationRequest {
  type?: ChatMessageType;
}
