import { ChatReactionType } from '../enums';
import type { ChatReactionCounts } from '../interfaces';

export const EMPTY_CHAT_REACTION_COUNTS: Readonly<ChatReactionCounts> = Object.freeze({
  [ChatReactionType.LIKE]: 0,
  [ChatReactionType.LOVE]: 0,
  [ChatReactionType.HAHA]: 0,
  [ChatReactionType.ANGRY]: 0,
});
