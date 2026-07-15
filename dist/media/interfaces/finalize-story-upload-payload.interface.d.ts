import type { MediaComposition } from './media-composition.interface';
import type { UserTagCoordinates } from './user-tag-coordinates.interface';
export interface FinalizeStoryUploadPayload {
    caption?: string;
    composition?: MediaComposition;
    tags?: UserTagCoordinates[];
}
