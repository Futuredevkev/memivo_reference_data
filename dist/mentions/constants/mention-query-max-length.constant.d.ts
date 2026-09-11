/**
 * Cuántos caracteres admite lo escrito después de la `@` antes de que la app
 * deje de pedir candidatos.
 *
 * Se DERIVA de `SEARCH_TERM_MAX` y no es un número propio: la consulta de una
 * mención viaja como el término de búsqueda de los endpoints de gente, y arriba
 * de ese tope el servidor la rechaza. Un número propio más grande sería una
 * consulta que la app arma y el servidor no acepta; uno más chico no tiene un
 * argumento que no sea el de las palabras, y ése ya lo pone
 * `MENTION_QUERY_MAX_WORDS`, que es el techo que en la práctica cierra el panel.
 */
export declare const MENTION_QUERY_MAX_LENGTH = 200;
