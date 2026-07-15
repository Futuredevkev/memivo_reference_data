import type { AlbumPermissions } from './internal/album-permissions.interface';

export interface AlbumAccessResponseAlbum<TTimestamp = string>
  extends AlbumPermissions {
  id: string;
  title: string;
  description: string | null;
  photoCount: number;
  creatorId: string;
  creatorName: string;
  scannedAt: TTimestamp | null;
}
