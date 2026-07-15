import type { ChatMessageResponse } from '../../chat';

export type ChatMessageSocketPayload<TTimestamp = string> =
  ChatMessageResponse<TTimestamp>;
