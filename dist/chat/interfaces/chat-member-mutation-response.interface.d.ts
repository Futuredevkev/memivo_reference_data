import type { ChatMemberRole, ChatMemberStatus } from '../enums';
export interface ChatMemberMutationResponse<TTimestamp = string> {
    id: string;
    chatGroupId: string;
    userId: string;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    joinedAt: TTimestamp;
}
