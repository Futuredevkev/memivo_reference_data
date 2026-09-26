import type { MediaFilterId } from '../../media';
import type { InviteChatMembersRequest } from './invite-chat-members-request.interface';
export interface CreateChatGroupRequest {
    albumId: string;
    name?: string;
    /**
     * Invitados opcionales elegidos al crear el grupo. El servidor conserva el
     * mismo tope y las mismas reglas que en las invitaciones posteriores.
     */
    memberIds?: InviteChatMembersRequest['memberIds'];
    /**
     * Acotado a `MediaFilterId` y no a `string`: el endpoint valida con
     * `@IsIn(MEDIA_FILTER_IDS)`, así que un id libre nunca fue aceptable. El
     * docblock del DTO prometía un degradado a «sin filtro» que no ocurre — la
     * request se rechaza con 400.
     */
    filterId?: MediaFilterId;
}
