/**
 * Cuántos caracteres tiene que tener lo escrito después de la `@` para que la
 * app pida candidatos.
 *
 * ── POR QUÉ HAY UN MÍNIMO ─────────────────────────────────────────────────
 * El panel de menciones pide en cada pausa del teclado, contra los mismos
 * endpoints que alimentan las listas de gente del álbum y del grupo. Con una o
 * dos letras la búsqueda infija (`%a%`) no entra por los índices trigram de
 * `users` —un trigrama son TRES caracteres— y además devuelve a casi todos:
 * mucho costo para una lista que no ayuda a elegir.
 *
 * ── POR QUÉ 3 ─────────────────────────────────────────────────────────────
 * Es el largo de un trigrama, el primer largo con el que el índice puede
 * estrechar. No se «unifica» con ningún otro mínimo de búsqueda: los
 * buscadores de las listas de gente buscan desde la primera letra a propósito,
 * y ése es otro producto.
 *
 * ── QUÉ NO ES ─────────────────────────────────────────────────────────────
 * No es un tope del servidor: esos endpoints aceptan términos de una letra
 * porque los usan los modales de gente. Del lado del servidor, lo que frena el
 * volumen del panel es el rate limit de esos endpoints. Esto es la cortesía de
 * la app para no pedir lo que no sirve.
 */
export const MENTION_QUERY_MIN_LENGTH = 3;
