/**
 * EL CUERPO de un alta social: texto O un sticker, nunca los dos ni ninguno.
 *
 * ── POR QUÉ ES UN SOLO TIPO Y NO UNO POR SUPERFICIE ────────────────────────
 * Porque esas altas contestan la MISMA pregunta —«¿qué mandó esta persona?»— y
 * escribirla por superficie es la forma en que las copias empiezan a discrepar:
 * una aceptaría los dos campos, otra ninguno, y el día que cambie la regla
 * habría que encontrarlas a mano (ORDEN §1).
 *
 * El chat queda afuera a propósito: usa un endpoint exclusivo para stickers,
 * sin campo `text` y con datos propios de la conversación. Forzarlo a esta forma
 * ofrecería una combinación que su tabla rechaza; su wire shape vive en
 * `SendStickerMessageRequest`.
 *
 * ── POR QUÉ NO SE PUEDE EXPRESAR LA EXCLUSIÓN EN EL TIPO ───────────────────
 * Una unión discriminada —`{text: string} | {stickerExternalId: string}`—
 * parece más honesta y es peor acá: los DTOs del servidor se validan con
 * decoradores sobre una CLASE, y una clase no puede ser una unión. El tipo
 * declara los dos opcionales y la exclusión la hacen dos cosas que sí pueden:
 * el validador del alta, y el `CHECK` de la tabla como backstop.
 *
 * Que el backstop sea la BASE y no sólo el validador es deliberado: es la misma
 * decisión que ya tomó el índice único que dedupea los mensajes de texto por
 * `clientTempId`. Dos altas simultáneas pasarían las dos por el validador.
 */
export interface TextOrStickerRequest {
    /** El texto, cuando lo que se manda es texto. */
    readonly text?: string;
    /**
     * El id del sticker EN EL CATÁLOGO del proveedor, cuando lo que se manda es
     * un sticker.
     *
     * Es el id EXTERNO y no el de nuestra fila, y esa asimetría con la respuesta
     * es a propósito: cuando alguien elige un sticker del selector, ese sticker
     * puede no tener fila todavía —nadie lo mandó nunca— así que no hay uuid
     * propio que mandar. El alta hace buscar-o-insertar y devuelve el nuestro.
     *
     * Y NO viajan las URLs. Una URL declarada por el cliente es una URL que todo
     * el chat va a cargar: el servidor las DERIVA de este id en vez de creerle a
     * nadie.
     */
    readonly stickerExternalId?: string;
}
