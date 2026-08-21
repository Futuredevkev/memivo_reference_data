import type { ChatMessageType, SystemMessageAction } from '../enums';
import type { ChatLocationPoint } from './chat-location-point.interface';
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
    /**
     * El mensaje llegó a este chat REENVIADO desde otro.
     *
     * Requerido y no opcional: todo mensaje es o no es un reenvío, y un
     * opcional deja la tercera opción —`undefined`— que ningún consumidor
     * sabe pintar. Es el mismo criterio con el que `isEdited` viaja al lado.
     *
     * **No dice de dónde ni de quién, y eso es la decisión, no una carencia**:
     * el rótulo avisa que lo que estás leyendo no lo escribió quien te lo
     * mandó, que es lo que hace falta para no atribuirle palabras ajenas.
     * Nombrar al autor original metería su identidad en una sala donde no
     * está y donde podría haber alguien que lo bloqueó.
     */
    isForwarded: boolean;
    created_at: TTimestamp;
    sender?: ChatUserSummary | null;
    files?: ChatMessageFileResponse[];
    replyToMessageId?: string | null;
    replyToMessage?: ChatReplyMessageResponse | null;
    systemAction?: SystemMessageAction | null;
    systemData?: SystemMessageData | null;
    sharedPostId?: string | null;
    /**
     * El PUNTO de un mensaje de ubicación FIJA. `null` en todo lo demás.
     *
     * Un compartir EN VIVO llega con esto en `null` y no es un olvido: su
     * posición no se guarda en la fila —es alta escritura, efímera y sin
     * historia, así que vive en Redis con vencimiento— y por eso un compartir
     * terminado no deja atrás un punto viejo que alguien pueda dibujar como si
     * fuera de ahora. Los dos campos se excluyen: quién es cuál lo dice
     * `liveLocationExpiresAt`.
     */
    location?: ChatLocationPoint | null;
    /**
     * Hasta cuándo transmite —o transmitía— un compartir de ubicación EN VIVO.
     * `null` = no es un compartir en vivo.
     *
     * Lo fija el SERVIDOR al abrirlo y no se mueve nunca: ni empujando
     * posiciones, ni reabriendo la app. Cortar antes lo adelanta a ahora, que es
     * la única escritura posterior que existe.
     *
     * El cliente lo usa para dibujar el estado de la burbuja sin preguntar nada
     * más, y eso es lo que hace que un compartir vencido se lea igual en un
     * teléfono que estuvo apagado que en uno que estaba mirando.
     */
    liveLocationExpiresAt?: TTimestamp | null;
    viewOnce?: boolean;
    viewOnceHasContent?: boolean;
    viewOnceViewedByMe?: boolean;
    viewOnceOpenedCount?: number;
    clientTempId?: string | null;
}
