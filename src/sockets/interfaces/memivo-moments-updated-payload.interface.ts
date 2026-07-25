import type { MemivoMoment } from '../../highlights';

export interface MemivoMomentsUpdatedPayload {
  albumId: string;
  moments: MemivoMoment[];
}
