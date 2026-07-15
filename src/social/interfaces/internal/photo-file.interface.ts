import type { ResourceType } from '../../../media';

export interface PhotoFile {
  id: string;
  url: string;
  resourceType: ResourceType;
  format: string;
  width: number | null;
  height: number | null;
}
