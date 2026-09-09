import type { MediaAvailability } from '../../media';
export interface CoverPhotoData extends MediaAvailability {
    url: string | null;
    thumbnailUrl: string | null;
}
