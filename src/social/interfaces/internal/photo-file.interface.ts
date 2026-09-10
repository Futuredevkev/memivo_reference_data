import type { MediaAvailability, ResourceType } from '../../../media';

export interface PhotoFile extends MediaAvailability {
  id: string;
  url: string;
  resourceType: ResourceType;
  format: string;
  width: number | null;
  height: number | null;
}
