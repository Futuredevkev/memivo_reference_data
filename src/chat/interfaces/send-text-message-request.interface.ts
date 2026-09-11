import type { MentionAnnotation } from '../../mentions';

export interface SendTextMessageRequest {
  albumId: string;
  content: string;
  replyToMessageId?: string;
  clientTempId?: string;
  /** Las menciones de `content`. Ausente y vacío dicen lo mismo. */
  mentions?: MentionAnnotation[];
}
