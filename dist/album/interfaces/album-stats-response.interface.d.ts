import type { AlbumStats } from './album-stats.interface';
export interface AlbumStatsResponse<TTimestamp = string> {
    stats: AlbumStats<TTimestamp>;
}
