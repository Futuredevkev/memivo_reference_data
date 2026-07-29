import type { MediaFilterId } from '../../media';

export interface UpdateChatGroupRequest {
  name?: string;
  /** Ver `CreateChatGroupRequest.filterId`. */
  filterId?: MediaFilterId;
}
