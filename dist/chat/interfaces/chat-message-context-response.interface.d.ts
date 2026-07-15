import type { ChatMessageContextMeta } from './chat-message-context-meta.interface';
export interface ChatMessageContextResponse<TMessage> {
    data: TMessage[];
    targetMessageId: string;
    meta: ChatMessageContextMeta;
}
