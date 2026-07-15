import type { AlbumGuest } from '../../album';
import type { PaginatedResponse } from '../../common';

export type ChatInvitableGuestsResponse<TTimestamp = string> = PaginatedResponse<
  AlbumGuest<TTimestamp>
>;
