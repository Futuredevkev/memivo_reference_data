export interface CreateChatGroupResponse<TTimestamp = string> {
  id: string;
  name: string | null;
  albumId: string;
  creatorId: string;
  avatarFileId?: string | null;
  created_at: TTimestamp;
  updated_at: TTimestamp;
  avatarUrl?: string | null;
  avatarThumbnailUrl?: string | null;
}
