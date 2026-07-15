import type { ReactionCounts, ReactionType } from '../../reactions';
export interface ToggleReactionResponse {
    reacted: boolean;
    type: ReactionType | null;
    reactionCounts: ReactionCounts;
}
