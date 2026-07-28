import type { ALBUM_SOCKET_EVENTS } from '../constants';
import type { StoryRoomPayload } from './story-room-payload.interface';
import type { SocketEventResponse } from './internal/socket-event-response.interface';

/**
 * Acuse de `join-story`. Su gemelo de álbum ya existía; el de story no, así que
 * ese handshake no tenía NINGUNA señal —ni de éxito ni de fallo— y el cliente
 * no podía distinguir «entré al room» de «me descartaron por cuota».
 */
export type StoryJoinSuccessResponse = SocketEventResponse<
  typeof ALBUM_SOCKET_EVENTS.OUT.JOIN_SUCCESS,
  StoryRoomPayload
>;
