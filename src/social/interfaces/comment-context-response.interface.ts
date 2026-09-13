import type { ContextWindowMeta } from '../../common';

export interface CommentContextResponse<TComment> {
  data: TComment[];
  targetCommentId: string;
  meta: ContextWindowMeta;
}
