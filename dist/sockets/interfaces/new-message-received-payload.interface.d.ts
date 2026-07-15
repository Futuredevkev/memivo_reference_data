import type { ChatMessageType } from '../../chat';
export interface NewMessageReceivedPayload<TTimestamp = string> {
    groupId: string;
    albumId: string;
    snippet: string | null;
    senderName?: string | null;
    type?: ChatMessageType;
    created_at?: TTimestamp;
}
