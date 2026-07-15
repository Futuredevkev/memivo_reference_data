import type { ErrorCode } from '../../errors';
import type { WsJoinResource } from '../constants';

export interface SocketJoinErrorPayload {
  resource: WsJoinResource;
  resourceId: string;
  statusCode: number;
  errorCode?: ErrorCode;
  message: string;
  groupId?: string;
  albumId?: string;
  storyId?: string;
}
