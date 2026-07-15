import type { ChatReactionAction, ChatReactionType } from '../../chat';

export interface ChatReactionUpdatedPayload {
  messageId: string;
  actorId: string;
  action: ChatReactionAction;
  reactionType: ChatReactionType;
  oldReactionType?: ChatReactionType;
}
