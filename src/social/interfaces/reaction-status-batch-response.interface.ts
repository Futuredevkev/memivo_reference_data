import type { ReactionType } from '../../reactions';

export interface ReactionStatusBatchResponse {
  comments: Record<string, ReactionType>;
  responses: Record<string, ReactionType>;
}
