import type { CreateChatGroupResponse } from './create-chat-group-response.interface';

export interface UpdateChatGroupResponse<TTimestamp = string> {
  success: true;
  group: CreateChatGroupResponse<TTimestamp>;
}
