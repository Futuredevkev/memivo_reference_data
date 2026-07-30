import type { AlbumMemberRole } from '../../album';
import type { MemivoMoment } from '../types';
export interface MemivoMomentsResponse<TTimestamp = string, TRole extends string = AlbumMemberRole> {
    moments: MemivoMoment<TRole>[];
}
