import type { ResourceType } from '../../../media';

export interface OpenViewOnceResponseFile {
  id: string;
  url: string;
  resourceType: ResourceType;
  width?: number | null;
  height?: number | null;
}
