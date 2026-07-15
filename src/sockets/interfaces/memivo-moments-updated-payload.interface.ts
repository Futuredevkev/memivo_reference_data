import type { MemivoPost } from '../../highlights';

export interface MemivoMomentsUpdatedPayload<TTimestamp = string> {
  albumId: string;
  moments: MemivoPost<TTimestamp>[];
}
