import type { AlbumMemberRole } from '../../album';
import type { HighlightActor } from './internal/highlight-actor.interface';
export interface HighlightPost<TTimestamp = string, TRole extends string = AlbumMemberRole> {
    id: string;
    description: string | null;
    user: HighlightActor<TRole>;
    count: number;
    thumbnailUrl: string | null;
    created_at: TTimestamp;
}
