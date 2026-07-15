import type { StoryCommentAuthor } from './story-comment-author.interface';
/** Story-comment payload shared by HTTP responses and socket events. */
export interface StoryCommentResponse<TTimestamp = string> {
    id: string;
    text: string;
    storyId: string;
    userId: string;
    user: StoryCommentAuthor;
    created_at: TTimestamp;
    updated_at: TTimestamp;
}
