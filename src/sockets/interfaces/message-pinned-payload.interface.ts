import type { ChatMessageResponse, ChatUserSummary } from '../../chat';

export interface MessagePinnedPayload<
  TMessage = ChatMessageResponse,
  TUser = Pick<ChatUserSummary, 'id'>,
> {
  groupId: string;
  messageId: string;
  message: TMessage;
  pinnedBy: TUser;
}
