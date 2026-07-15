export interface SendTextMessageRequest {
  albumId: string;
  content: string;
  replyToMessageId?: string;
  clientTempId?: string;
}
