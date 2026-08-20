import type { ChatContentPayload } from '../enums';
/**
 * Qué ES el contenido de un `ChatMessageType`, con las dos preguntas que el
 * sistema entero le hace a un tipo de mensaje.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Las dos preguntas se contestaban con LISTAS ESCRITAS A MANO, y una lista no
 * tiene gate: el próximo `ChatMessageType` queda afuera **en silencio** y
 * hereda el comportamiento de estar afuera sin que nadie lo haya decidido.
 * `CHAT_MEDIA_MESSAGE_TYPES` era una de ésas, y de ella colgaban el pipeline de
 * subida, el filtro de la galería y el `WHERE` de un índice PARCIAL de
 * Postgres: agregar un tipo con archivos sin tocarla lo dejaba fuera del índice
 * sin que fallara nada — una consulta que deja de usar índice no se pone roja,
 * se pone lenta, y recién con volumen (ORDEN §6).
 *
 * ── POR QUÉ SON DOS CAMPOS Y NO DOS TABLAS ─────────────────────────────────
 * Porque son dos preguntas sobre la MISMA cosa —qué contenido tiene este tipo—
 * y separarlas dejaría dos tablas que hay que acordarse de completar las dos.
 * Y no son la misma pregunta: `DOCUMENT` lleva archivos y **no** entra a la
 * galería de multimedia, así que el día que las dos respuestas se separaron,
 * un solo campo habría mentido en una de las dos.
 */
export interface ChatMessageContentRule {
    /**
     * Qué carga lleva el mensaje. Es lo que decide si el tipo puede venir del
     * pipeline de subida (`FILES`) y lo que hay que volver a autorizar cuando el
     * mensaje entra a otro chat.
     */
    readonly payload: ChatContentPayload;
    /**
     * Si sus archivos entran a la GALERÍA de multimedia del chat.
     *
     * No es «¿tiene archivos?»: la galería es una grilla de miniaturas más una
     * lista de audios, y un documento no tiene miniatura ni se puede abrir en el
     * visor. Además este campo gobierna el `WHERE` de `IDX_chat_messages_group_media`,
     * así que cambiarlo para un tipo ya existente pide migración — y hay un gate
     * que lo afirma contra la última migración que crea ese índice.
     */
    readonly inMediaGallery: boolean;
}
