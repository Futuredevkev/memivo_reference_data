import type { ChatRoleBadge } from '../enums';
import type { ChatAvatarResponse } from './internal/chat-avatar-response.interface';
export interface ChatUserSummary {
    id: string;
    name: string;
    lastName: string;
    avatar?: ChatAvatarResponse | null;
    chatRole?: ChatRoleBadge | null;
}
