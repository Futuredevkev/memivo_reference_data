import type { ChatUserSummary } from '../../chat';
export interface ChatUserJoinedPayload {
    groupId: string;
    user: ChatUserSummary;
}
