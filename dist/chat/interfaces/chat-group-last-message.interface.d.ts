import type { ChatMessageType } from '../enums';
export interface ChatGroupLastMessage<TTimestamp = string> {
    content: string | null;
    type: ChatMessageType | null;
    senderName: string | null;
    created_at: TTimestamp | null;
}
