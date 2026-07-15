import { ALBUM_CHAT_ACCESS_REVOKED_REASON } from './album-chat-access-revoked-reason.constant';

export type AlbumChatAccessRevokedReason =
  (typeof ALBUM_CHAT_ACCESS_REVOKED_REASON)[keyof typeof ALBUM_CHAT_ACCESS_REVOKED_REASON];
