import type { GuestPostMediaComposition } from './guest-post-media-composition.interface';
import type { GuestPostTagItem } from './guest-post-tag-item.interface';
export interface FinalizeGuestPostUploadPayload {
    description?: string;
    displayAspectRatio?: number;
    mediaCompositions?: GuestPostMediaComposition[];
    tags?: GuestPostTagItem[];
    /**
     * Pedido de avisarle a todo el álbum con esta publicación. Mismo contrato que
     * el de la publicación con texto solo: es un pedido, y el servidor decide.
     */
    announce?: boolean;
}
