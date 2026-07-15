import type { ChatMemberSummaryResponse } from './internal/chat-member-summary-response.interface';
export interface ChatMemberResponse<TTimestamp = string> extends ChatMemberSummaryResponse<TTimestamp> {
    lastReadAt: TTimestamp | null;
    muted: boolean;
}
