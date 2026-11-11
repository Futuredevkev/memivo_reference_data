import type { TimelinePaginationRequest } from '../../common';
/** El feed del álbum: texto, persona etiquetada e «ir a una fecha» (`before`). */
export interface GetGuestPostsQueryRequest extends TimelinePaginationRequest {
    taggedUserId?: string;
}
