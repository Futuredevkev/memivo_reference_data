import type { ChatReactionType } from '../enums';

export interface ToggleChatReactionRequest {
  type: ChatReactionType;
  albumId: string;
}
