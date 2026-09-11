/**
 * Códigos de error de las menciones.
 *
 * Son dos y no uno porque la persona puede hacer algo distinto con cada uno:
 * pasarse del tope se resuelve sacando menciones —y la frase dice cuántas se
 * pueden—, mientras que una anotación mal formada no la produce la app, así que
 * no hay nada que la persona pueda corregir. Juntarlas obligaría a la app a
 * decir el tope sobre un error que no tiene nada que ver con cuántas son.
 *
 * Lo que NO tiene código, a propósito: que la persona mencionada ya no pueda
 * leer el texto, o que haya cambiado su nombre entre la sugerencia y el envío.
 * Eso es una carrera que quien escribe no controla ni puede resolver, así que
 * el servidor no rechaza: saca la anotación y el nombre queda como texto.
 */
export declare enum MentionErrorCode {
    /**
     * El texto trae más menciones que `MENTIONS_MAX_ITEMS`. La app frena la
     * inserción con la misma constante, así que llega cuando el cuerpo no salió
     * de ella.
     */
    MENTIONS_TOO_MANY = "MENTIONS_TOO_MANY",
    /**
     * Una anotación no se puede aplicar sobre el texto: offsets que no son
     * enteros o se salen del texto, que no caen sobre un `@`, que se pisan o no
     * vienen en orden. Las causas exactas las publica `MentionAnnotationsDefect`.
     */
    MENTION_ANNOTATION_INVALID = "MENTION_ANNOTATION_INVALID"
}
