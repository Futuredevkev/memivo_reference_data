import type { GuestPostAnnouncementSkip } from './guest-post-announcement-skip.interface';
import type { GuestPostResponse } from './guest-post-response.interface';

/**
 * La respuesta de crear una publicación, por cualquiera de sus dos caminos (con
 * texto solo o con fotos y videos).
 */
export interface GuestPostOperationResponse<TTimestamp = string> {
  message: string;
  post: GuestPostResponse<TTimestamp>;
  /**
   * Se pidió avisar a todos y no salió: por qué. `null` cuando no se pidió o
   * cuando el aviso salió (silencio = éxito).
   */
  announcementSkip: GuestPostAnnouncementSkip<TTimestamp> | null;
}
