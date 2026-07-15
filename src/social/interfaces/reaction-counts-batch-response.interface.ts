import type { ReactionCounts } from '../../reactions';

export interface ReactionCountsBatchResponse {
  comments: Record<string, ReactionCounts>;
  responses: Record<string, ReactionCounts>;
}
