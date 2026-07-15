import type { ResourceType } from '../../media';

export interface StoryFileInfo {
  url: string;
  thumbnailUrl: string | null;
  format: string;
  resourceType: `${ResourceType}`;
  width?: number;
  height?: number;
}
