import type { AlbumHighlights } from '../../highlights';
export interface HighlightsUpdatedPayload<TTimestamp = string> {
    albumId: string;
    highlights: AlbumHighlights<TTimestamp>;
}
