import type { AlbumMemberRole } from '../../album';
import type { MemivoPost } from './memivo-post.interface';
export interface MemivoMomentsResponse<TTimestamp = string, TRole extends string = AlbumMemberRole> {
    moments: MemivoPost<TTimestamp, TRole>[];
    updatedAt: TTimestamp;
}
