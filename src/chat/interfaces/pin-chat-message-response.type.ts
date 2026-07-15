import type { PinnedChatMessageResponse } from './pinned-chat-message-response.interface';

export type PinChatMessageResponse<TTimestamp = string> = Omit<
  PinnedChatMessageResponse<TTimestamp>,
  'message' | 'pinnedBy'
>;
