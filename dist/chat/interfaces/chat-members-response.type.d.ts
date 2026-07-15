import type { PaginatedResponse } from '../../common';
import type { ChatMemberResponse } from './chat-member-response.interface';
export type ChatMembersResponse<TTimestamp = string> = PaginatedResponse<ChatMemberResponse<TTimestamp>>;
