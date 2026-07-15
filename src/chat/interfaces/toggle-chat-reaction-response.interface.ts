import type { ChatReactionType } from '../enums';
import type { ChatReactionCounts } from './chat-reaction-counts.type';

export interface ToggleChatReactionResponse {
  reacted: boolean;
  type: ChatReactionType | null;
  reactionCounts: ChatReactionCounts;
}
