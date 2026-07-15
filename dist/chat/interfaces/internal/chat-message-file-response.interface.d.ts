import type { ResourceType } from '../../../media';
export interface ChatMessageFileResponse {
    id: string;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    resourceType: ResourceType;
    filterId?: string | null;
}
