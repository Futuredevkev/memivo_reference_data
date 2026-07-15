import type { AlbumPermissions } from './internal/album-permissions.interface';

export interface AlbumListItemResponse<TTimestamp = string>
  extends AlbumPermissions {
  id: string;
  title: string;
  description: string;
  qrCode: string;
  isVisible: boolean;
  creatorId: string;
  created_at: TTimestamp;
  scannedAt: TTimestamp;
  coverPhoto: string | null;
  coverPhotoThumbnailUrl: string | null;
  creatorName: string;
}
