import type { PollVote } from './poll-vote.interface';

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  position: number;
  votes?: PollVote[];
}
