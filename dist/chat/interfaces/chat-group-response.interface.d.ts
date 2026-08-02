import type { ChatMemberRole, ChatMemberStatus } from '../enums';
import type { ChatGroupLastMessage } from './chat-group-last-message.interface';
export interface ChatGroupResponse<TTimestamp = string> {
    id: string;
    albumId: string;
    name?: string | null;
    creatorId: string;
    created_at: TTimestamp;
    /** Canonical activity key used by the server cursor and every client sort. */
    lastMessageAt: TTimestamp;
    unreadCount: number;
    avatarUrl?: string | null;
    avatarThumbnailUrl?: string | null;
    lastMessage: ChatGroupLastMessage<TTimestamp> | null;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    joinedAt: TTimestamp;
    isMuted: boolean;
}
