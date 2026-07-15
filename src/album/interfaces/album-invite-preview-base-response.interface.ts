import type { AlbumInviteType } from '../enums';
import type { AlbumPreviewSummary } from './album-preview-summary.interface';

export interface AlbumInvitePreviewBaseResponse extends AlbumPreviewSummary {
  shareUrl: string;
  type: AlbumInviteType;
  title: string;
  description: string;
}
