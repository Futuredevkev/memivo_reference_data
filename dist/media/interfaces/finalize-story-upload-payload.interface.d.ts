import type { CreateStoryPollRequest } from '../../stories';
import type { MediaComposition } from './media-composition.interface';
import type { UserTagCoordinates } from './user-tag-coordinates.interface';
export interface FinalizeStoryUploadPayload {
    caption?: string;
    composition?: MediaComposition;
    tags?: UserTagCoordinates[];
    /**
     * Encuesta persistida en la MISMA transacción que la historia, por la misma
     * razón que los tags: un fallo parcial no puede dejar una historia sin su
     * encuesta ni una encuesta sin historia.
     */
    poll?: CreateStoryPollRequest;
}
