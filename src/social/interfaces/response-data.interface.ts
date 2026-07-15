import type { ReactionCounts, ReactionType } from '../../reactions';
import type { SocialAuthor } from './social-author.interface';

export interface ResponseData<TTimestamp = string> {
  id: string;
  text: string;
  commentId: string;
  userId: string;
  user: SocialAuthor;
  created_at: TTimestamp;
  updated_at: TTimestamp;
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
}
