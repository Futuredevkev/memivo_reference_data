import type { ChatMessageResponse } from './chat-message-response.interface';
import type { ChatUserSummary } from './chat-user-summary.interface';
export interface PinnedChatMessageResponse<TTimestamp = string> {
    id: string;
    chatGroupId: string;
    messageId: string;
    pinnedById: string;
    pinnedAt: TTimestamp;
    order: number;
    message: ChatMessageResponse<TTimestamp>;
    pinnedBy?: ChatUserSummary | null;
}
