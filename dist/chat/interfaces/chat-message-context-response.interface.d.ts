import type { ContextWindowMeta } from '../../common';
export interface ChatMessageContextResponse<TMessage> {
    data: TMessage[];
    targetMessageId: string;
    meta: ContextWindowMeta;
}
