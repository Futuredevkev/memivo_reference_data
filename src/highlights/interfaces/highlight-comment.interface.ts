import type { AlbumMemberRole } from '../../album';
import type { HighlightActor } from './internal/highlight-actor.interface';

export interface HighlightComment<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  id: string;
  text: string;
  guestPostId: string;
  user: HighlightActor<TRole>;
  reactionCount: number;
  created_at: TTimestamp;
}
