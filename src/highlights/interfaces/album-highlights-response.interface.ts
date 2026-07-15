import type { AlbumMemberRole } from '../../album';
import type { AlbumHighlights } from './album-highlights.interface';

export interface AlbumHighlightsResponse<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  highlights: AlbumHighlights<TTimestamp, TRole>;
}
