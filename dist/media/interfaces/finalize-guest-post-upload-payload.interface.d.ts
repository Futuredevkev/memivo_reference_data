import type { GuestPostMediaComposition } from './guest-post-media-composition.interface';
import type { GuestPostTagItem } from './guest-post-tag-item.interface';
export interface FinalizeGuestPostUploadPayload {
    description?: string;
    displayAspectRatio?: number;
    mediaCompositions?: GuestPostMediaComposition[];
    tags?: GuestPostTagItem[];
}
