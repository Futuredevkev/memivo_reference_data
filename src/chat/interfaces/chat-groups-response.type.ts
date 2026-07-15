import type { PaginatedResponse } from '../../common';
import type { ChatGroupResponse } from './chat-group-response.interface';

export type ChatGroupsResponse<TTimestamp = string> = PaginatedResponse<
  ChatGroupResponse<TTimestamp>
>;
