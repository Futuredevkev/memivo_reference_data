import type { TimelinePaginationRequest } from '../../common';
import type { ChatMessageType } from '../enums';
/** La galería de un grupo: tipo, texto e «ir a una fecha» (`before`). */
export interface GetGroupMediaQueryRequest extends TimelinePaginationRequest {
    type?: ChatMessageType;
}
