import type { ReactionType } from '../../reactions';

export interface ToggleReactionRequest {
  type: ReactionType;
  albumId: string;
}
