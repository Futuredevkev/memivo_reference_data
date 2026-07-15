import type { ReactionCounts, ReactionType } from '../../reactions';
import type { SocialAuthor } from './social-author.interface';
export interface CommentResponse<TTimestamp = string> {
    id: string;
    text: string;
    userId: string;
    guestPostId: string;
    user: SocialAuthor;
    created_at: TTimestamp;
    updated_at: TTimestamp;
    responsesCount?: number;
    reactionCounts: ReactionCounts;
    userReaction: ReactionType | null;
}
