import type { CommentContextMeta } from './comment-context-meta.interface';

export interface CommentContextResponse<TComment> {
  data: TComment[];
  targetCommentId: string;
  meta: CommentContextMeta;
}
