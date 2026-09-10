import type { MediaAvailability, ResourceType } from '../../../media';

export interface OpenViewOnceResponseFile extends MediaAvailability {
  id: string;
  url: string;
  resourceType: ResourceType;
  width?: number | null;
  height?: number | null;
}
