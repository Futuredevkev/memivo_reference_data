/**
 * UNA MENCIÓN dentro de un texto libre: dónde está y a quién apunta.
 *
 * ── POR QUÉ EL TEXTO SE GUARDA TAL COMO SE VE Y ESTO VA APARTE ────────────
 * El texto viaja y se persiste verbatim —«@Ana López mirá esto»—, no con un
 * token `@[uuid]` adentro. Con token, el índice trigram de `chat_messages`
 * (`lower(content)`) dejaría de encontrar un mensaje por el nombre de quien se
 * mencionó, y el tope de caracteres pasaría a contar el uuid en vez de lo que la
 * persona ve: el tope mentiroso que la ola de topes de texto cerró. Así ningún
 * lector existente del texto —push, búsqueda, cita, moderación— tiene que
 * aprender a parsear nada.
 *
 * La anotación no aporta identidad nueva: aporta un PUNTERO sobre un nombre que
 * ya está escrito. Por eso degrada sola: si el `userId` deja de existir, lo que
 * queda es texto plano que sigue diciendo la verdad.
 *
 * ── LA UNIDAD DE LOS OFFSETS: UNIDADES DE CÓDIGO UTF-16 ──────────────────
 * Exactamente el índice que consume `String.prototype.slice`, en las dos
 * puntas (JavaScript en el servidor y en la app).
 *
 * ⚠️ NO es la unidad del TOPE, y conviven en el mismo campo a propósito. El
 * tope cuenta con `validatedTextLength`, que resta pares sustitutos y
 * selectores de presentación; un offset no cuenta, INDEXA. Esa función no tiene
 * un `slice` que la respete ni es invertible sin recorrer el string. O sea que
 * en un comentario con emoji `start` puede ser MAYOR que el tope del campo, y
 * es legítimo: no lo «arregles».
 *
 * La invariante que ata esto al texto tiene dueño único:
 * {@link mentionMatchesText}.
 */
export interface MentionAnnotation {
    /** La persona mencionada. */
    userId: string;
    /** Dónde arranca el `@`, en unidades UTF-16. */
    start: number;
    /** Cuántas unidades UTF-16 ocupa, `@` incluido. */
    length: number;
}
