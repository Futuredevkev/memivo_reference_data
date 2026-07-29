import type { MediaFilterId } from '../../media';
export interface CreateChatGroupRequest {
    albumId: string;
    name?: string;
    /**
     * Acotado a `MediaFilterId` y no a `string`: el endpoint valida con
     * `@IsIn(MEDIA_FILTER_IDS)`, así que un id libre nunca fue aceptable. El
     * docblock del DTO prometía un degradado a «sin filtro» que no ocurre — la
     * request se rechaza con 400.
     */
    filterId?: MediaFilterId;
}
