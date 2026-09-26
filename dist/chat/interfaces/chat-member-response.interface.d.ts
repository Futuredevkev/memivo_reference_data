import type { ChatMemberSummaryResponse } from './internal/chat-member-summary-response.interface';
export interface ChatMemberResponse<TTimestamp = string> extends ChatMemberSummaryResponse<TTimestamp> {
    lastReadAt: TTimestamp | null;
    muted: boolean;
    /** Señala acceso elevado derivado del rol vigente en el álbum. */
    isAlbumModerator: boolean;
}
