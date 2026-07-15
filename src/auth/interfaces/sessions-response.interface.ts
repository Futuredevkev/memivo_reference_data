import type { SessionSummary } from './session-summary.interface';

export interface SessionsResponse<TTimestamp = string> {
  sessions: SessionSummary<TTimestamp>[];
}
