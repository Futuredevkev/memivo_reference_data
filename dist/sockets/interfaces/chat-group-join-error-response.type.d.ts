import type { CHAT_SOCKET_EVENTS } from '../constants';
import type { SocketEventResponse } from './internal/socket-event-response.interface';
import type { SocketJoinErrorPayload } from './socket-join-error-payload.interface';
export type ChatGroupJoinErrorResponse = SocketEventResponse<typeof CHAT_SOCKET_EVENTS.OUT.JOIN_ERROR, SocketJoinErrorPayload>;
