import type { ChatMessageType } from '../../enums';
import type { ChatMessageFileResponse } from './chat-message-file-response.interface';
import type { ChatUserSummary } from '../chat-user-summary.interface';

export interface ChatReplyMessageResponse {
  id: string;
  content: string | null;
  type: ChatMessageType;
  sender: ChatUserSummary;
  files?: ChatMessageFileResponse[];
  viewOnce?: boolean;
}
