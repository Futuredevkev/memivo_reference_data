import type { ChatMessageType, SystemMessageAction } from '../enums';
import type { ChatMessageFileResponse } from './internal/chat-message-file-response.interface';
import type { ChatReplyMessageResponse } from './internal/chat-reply-message-response.interface';
import type { ChatUserSummary } from './chat-user-summary.interface';
import type { SystemMessageData } from './system-message-data.interface';
/**
 * El mensaje NO lleva sus reacciones ni la del viewer, y eso es deliberado: se
 * piden fuera de banda con `POST /chat/reactions/counts` y
 * `/chat/reactions/check-status`, y viven en mapas del store indexados por
 * messageId. `reactions` y `userReaction` estaban declarados acá y **ningún
 * archivo del API los asignaba jamás** (H-035): quien leyera el contrato para
 * escribir un consumidor nuevo hacía `message.reactions?.LIKE ?? 0` y obtenía 0
 * en TODO mensaje — 200 OK con el número mentido.
 *
 * `filesDeleted` tampoco viaja: la columna existe y gobierna el ciclo de
 * view-once del lado servidor, pero el cliente decide con
 * `viewOnceHasContent`.
 */
export interface ChatMessageResponse<TTimestamp = string> {
    id: string;
    chatGroupId: string;
    senderId: string | null;
    content: string | null;
    type: ChatMessageType;
    isEdited: boolean;
    created_at: TTimestamp;
    sender?: ChatUserSummary | null;
    files?: ChatMessageFileResponse[];
    replyToMessageId?: string | null;
    replyToMessage?: ChatReplyMessageResponse | null;
    systemAction?: SystemMessageAction | null;
    systemData?: SystemMessageData | null;
    sharedPostId?: string | null;
    viewOnce?: boolean;
    viewOnceHasContent?: boolean;
    viewOnceViewedByMe?: boolean;
    viewOnceOpenedCount?: number;
    clientTempId?: string | null;
}
