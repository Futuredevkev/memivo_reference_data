import type { ChatContentBinding, ChatContentOrigin } from '../enums';
/**
 * La regla de UN `ChatMessageType`: si su contenido puede entrar a otro chat y,
 * si puede, qué estados lo atan igual a la sala donde nació.
 *
 * Es una unión discriminada por `origin` y no un objeto plano porque lo que la
 * app construye no tiene estado que lo ate: pedirle `boundBy: []` sería
 * escribir un dato que nadie va a leer nunca (ORDEN §7). Con la unión,
 * clasificar un tipo como `APP` cierra la decisión en una línea.
 *
 * ── LO QUE ESTA REGLA YA NO DECLARA, Y POR QUÉ ─────────────────────────────
 * Tenía un tercer campo, `carries`, con la carga que hay que readmitir en el
 * destino. Ese dato es una propiedad del TIPO —qué trae adentro un `IMAGE`— y
 * no de la mudanza, así que cuando `CHAT_MESSAGE_CONTENT_BY_TYPE` apareció
 * para contestar esa misma pregunta al pipeline de subida, quedaron dos
 * lugares afirmando «IMAGE lleva archivos» (ORDEN §1). La puerta lo lee del
 * catálogo y el veredicto lo sigue devolviendo adentro, así que el ejecutor de
 * la mudanza no volvió a mirar el `type` ni una sola vez.
 */
export type ChatContentRelocationRule = {
    /** La app lo construyó a partir de un hecho de ESE chat: no sale de ahí. */
    readonly origin: ChatContentOrigin.APP;
} | {
    readonly origin: ChatContentOrigin.PERSON;
    /**
     * Los estados que, cuando se dan, lo atan igual a su chat. Vacío = el
     * tipo se muda siempre.
     */
    readonly boundBy: readonly ChatContentBinding[];
};
