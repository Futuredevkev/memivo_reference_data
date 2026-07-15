import type { StoryResponse } from '../../stories';

export interface StoriesUpdatedPayload<TTimestamp = string> {
  albumId: string;
  stories: StoryResponse<TTimestamp>[];
}
