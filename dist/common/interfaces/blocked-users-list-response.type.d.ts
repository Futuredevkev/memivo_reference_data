import type { BlockedUserSummary } from './blocked-user-summary.interface';
import type { PaginatedResponse } from './paginated-response.interface';
export type BlockedUsersListResponse<TTimestamp = string> = PaginatedResponse<BlockedUserSummary<TTimestamp>>;
