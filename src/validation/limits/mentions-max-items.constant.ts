/**
 * Cuántas personas se pueden mencionar en UN texto: un mensaje de chat, un
 * comentario, una respuesta o un comentario de historia.
 *
 * Decide cuántas deja insertar la app Y cuántas acepta el servidor, por el
 * mismo motivo que sus hermanos `*_TAGS_MAX_ITEMS`: si los dos números
 * divergen, la persona escribe y recién al mandar se entera de que no entraba.
 *
 * ── POR QUÉ HAY UN TOPE, Y NO ES DE PLAN ──────────────────────────────────
 * Cada mención es un aviso persistido y una push a otra persona. Sin tope, un
 * solo texto de cinco mil caracteres puede notificar a un grupo entero de a
 * uno, que es una lista de difusión disfrazada de mención — y la mención de
 * este producto no es un canal privilegiado: respeta el silenciado como
 * cualquier aviso del hilo. Es un freno de abuso, igual para todos.
 *
 * ── POR QUÉ 10 ────────────────────────────────────────────────────────────
 * Es el mismo número que `STORY_TAGS_MAX_ITEMS`, y por el mismo argumento
 * escrito allá: diez personas cubren de sobra la mesa de un evento, y más que
 * eso deja de ser señalar a alguien y pasa a ser avisarle a todos. No se
 * «unifica» con aquél: coinciden por argumento, no por dueño, y el día que uno
 * se mueva el otro no tiene por qué seguirlo.
 */
export const MENTIONS_MAX_ITEMS = 10;
