import type { CommentResponse } from './comment-response.interface';

export interface CommentCreatedResponse<TTimestamp = string>
  extends CommentResponse<TTimestamp> { commentsCount: number; }
