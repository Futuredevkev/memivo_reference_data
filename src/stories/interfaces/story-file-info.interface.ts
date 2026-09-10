import type { MediaAvailability, ResourceType } from '../../media';

export interface StoryFileInfo extends MediaAvailability {
  url: string;
  thumbnailUrl: string | null;
  format: string;
  resourceType: `${ResourceType}`;
  width?: number;
  height?: number;
}
