import type { UserPlanTier } from '../../billing';
import type { ChatRoleBadge } from '../enums';
import type { ChatAvatarResponse } from './internal/chat-avatar-response.interface';

export interface ChatUserSummary extends UserPlanTier {
  id: string;
  name: string;
  lastName: string;
  avatar?: ChatAvatarResponse | null;
  chatRole?: ChatRoleBadge | null;
}
