import type { ChatMemberRole, ChatMemberStatus } from '../enums';
import type { ChatGroupLastMessage } from './chat-group-last-message.interface';
export interface ChatGroupResponse<TTimestamp = string> {
    id: string;
    albumId: string;
    name?: string | null;
    creatorId: string;
    created_at: TTimestamp;
    unreadCount: number;
    avatarUrl?: string | null;
    avatarThumbnailUrl?: string | null;
    lastMessage: ChatGroupLastMessage<TTimestamp> | null;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    joinedAt: TTimestamp;
    isMuted: boolean;
}
