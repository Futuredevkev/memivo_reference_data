import type { PollResponse } from '../../chat';

export type ChatPollSocketPayload<TTimestamp = string> =
  PollResponse<TTimestamp>;
