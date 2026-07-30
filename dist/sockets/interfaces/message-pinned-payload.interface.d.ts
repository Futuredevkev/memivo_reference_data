import type { ChatMessageResponse } from '../../chat';
/**
 * `pinnedBy` no viaja: el banner de fijados pinta `message.sender`, no quién lo
 * fijó, y ese dato costaba un LEFT JOIN a `users` por emisión (H-045).
 */
export interface MessagePinnedPayload<TMessage = ChatMessageResponse> {
    groupId: string;
    messageId: string;
    message: TMessage;
}
