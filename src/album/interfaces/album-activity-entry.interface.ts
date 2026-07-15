import type { AlbumActionTargetType, AlbumActionType, AlbumActorRole } from '../enums';
import type { AlbumActionDetail } from './album-action-detail.interface';

export interface AlbumActivityEntry<TTimestamp = string> {
  id: string;
  action: AlbumActionType;
  actorUserId: string | null;
  actorName: string | null;
  actorRole: AlbumActorRole;
  targetType: AlbumActionTargetType;
  targetUserId: string | null;
  targetName: string | null;
  targetId: string | null;
  detail: AlbumActionDetail | null;
  correlationId: string | null;
  createdAt: TTimestamp;
}
