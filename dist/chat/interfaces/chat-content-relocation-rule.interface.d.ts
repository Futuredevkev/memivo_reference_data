import type { ChatContentBinding, ChatContentOrigin, ChatContentPayload } from '../enums';
/**
 * La regla de UN `ChatMessageType`: si su contenido puede entrar a otro chat y,
 * si puede, qué se lleva con él.
 *
 * Es una unión discriminada por `origin` y no un objeto plano con tres campos
 * porque lo que la app construye no tiene carga que readmitir ni estado que lo
 * ate: pedirle `carries: NONE` y `boundBy: []` sería escribir dos datos que
 * nadie va a leer nunca (ORDEN §7). Con la unión, clasificar un tipo como `APP`
 * cierra la decisión en una línea y clasificarlo como `PERSON` obliga a
 * contestar las otras dos.
 */
export type ChatContentRelocationRule = {
    /** La app lo construyó a partir de un hecho de ESE chat: no sale de ahí. */
    readonly origin: ChatContentOrigin.APP;
} | {
    readonly origin: ChatContentOrigin.PERSON;
    /** Qué hay que volver a autorizar en el chat de destino. */
    readonly carries: ChatContentPayload;
    /**
     * Los estados que, cuando se dan, lo atan igual a su chat. Vacío = el
     * tipo se muda siempre.
     */
    readonly boundBy: readonly ChatContentBinding[];
};
