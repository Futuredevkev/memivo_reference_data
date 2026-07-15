import type { PaginationRequest } from '../../common';
import type { AlbumActionType } from '../enums';
export interface AlbumActivityQueryRequest extends PaginationRequest {
    action?: AlbumActionType;
    actorId?: string;
    targetUserId?: string;
    from?: string;
    to?: string;
}
