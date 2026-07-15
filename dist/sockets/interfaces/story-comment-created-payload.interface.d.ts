import type { StoryCommentResponse } from '../../stories';
export interface StoryCommentCreatedPayload<TTimestamp = string> {
    storyId: string;
    comment: StoryCommentResponse<TTimestamp>;
}
