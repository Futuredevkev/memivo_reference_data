import type { ALBUM_SOCKET_EVENTS } from '../constants';
import type { AlbumRoomPayload } from './album-room-payload.interface';
import type { SocketEventResponse } from './internal/socket-event-response.interface';

export type AlbumJoinSuccessResponse = SocketEventResponse<
  typeof ALBUM_SOCKET_EVENTS.OUT.JOIN_SUCCESS,
  AlbumRoomPayload
>;
