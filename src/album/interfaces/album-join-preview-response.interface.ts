import type { AlbumPreviewSummary } from './album-preview-summary.interface';

export interface AlbumJoinPreviewResponse extends AlbumPreviewSummary {
  shareUrl: string;
  title: string;
  description: string;
  authorName: string;
}
