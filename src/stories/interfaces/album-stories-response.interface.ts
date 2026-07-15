import type { StoryResponse } from './story-response.interface';

export interface AlbumStoriesResponse<TTimestamp = string> {
  stories: StoryResponse<TTimestamp>[];
}
