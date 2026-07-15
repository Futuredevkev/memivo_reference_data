import type { ChatMemberRole, ChatMemberStatus } from '../../enums';
import type { ChatUserSummary } from '../chat-user-summary.interface';

export interface ChatMemberSummaryResponse<TTimestamp = string> {
  id: string;
  chatGroupId: string;
  userId: string;
  role: ChatMemberRole;
  status: ChatMemberStatus;
  joinedAt: TTimestamp;
  user: ChatUserSummary;
}
