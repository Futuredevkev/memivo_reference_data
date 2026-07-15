import type { CHAT_SOCKET_EVENTS } from '../constants';
import type { GroupIdPayload } from './group-id-payload.interface';
import type { SocketEventResponse } from './internal/socket-event-response.interface';
export type ChatGroupJoinSuccessResponse = SocketEventResponse<typeof CHAT_SOCKET_EVENTS.OUT.JOIN_SUCCESS, GroupIdPayload>;
