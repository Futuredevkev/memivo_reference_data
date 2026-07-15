import { ChatMessageType } from '../enums';

export const CHAT_MEDIA_MESSAGE_TYPES = [
  ChatMessageType.IMAGE,
  ChatMessageType.VIDEO,
  ChatMessageType.AUDIO,
] as const;
