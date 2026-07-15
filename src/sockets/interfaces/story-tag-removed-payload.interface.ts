import type { TagAddedPayload } from './tag-added-payload.interface';

export interface StoryTagRemovedPayload extends TagAddedPayload {
  storyId: string;
}
