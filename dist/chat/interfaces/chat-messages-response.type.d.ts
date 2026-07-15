import type { PaginatedResponse } from '../../common';
import type { ChatMessageResponse } from './chat-message-response.interface';
export type ChatMessagesResponse<TTimestamp = string> = PaginatedResponse<ChatMessageResponse<TTimestamp>>;
