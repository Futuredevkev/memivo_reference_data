import type { AlbumMemberRole } from '../../album';
import type { HighlightActor } from './internal/highlight-actor.interface';

export interface MemivoPost<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  id: string;
  description: string | null;
  thumbnailUrl: string | null;
  user: HighlightActor<TRole>;
  score: number;
  peakScore: number;
  detectedAt: TTimestamp;
}
