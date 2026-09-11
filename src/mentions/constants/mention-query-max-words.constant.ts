/**
 * Cuántas palabras admite lo escrito después de la `@` antes de que la app deje
 * de tratarlo como el nombre de alguien.
 *
 * ── POR QUÉ LA CONSULTA ADMITE ESPACIOS ───────────────────────────────────
 * El nombre visible es nombre Y apellido (`formatPersonDisplayName`), así que
 * cortar la consulta en el primer espacio haría imposible escribir el apellido,
 * que es la mitad de lo que se pidió. Pero sin un techo, cualquier oración que
 * siga a una `@` sería una consulta, y cada pausa del teclado, un pedido.
 *
 * ── POR QUÉ 4 ─────────────────────────────────────────────────────────────
 * Dos nombres y dos apellidos —«María José Pérez García»— es la forma más
 * larga de nombre de pila y apellido que el producto espera con normalidad.
 * Una quinta palabra ya es una oración, y el panel se cierra.
 *
 * Lo decide la app sola —el servidor no mira la consulta, mira la anotación—,
 * y vive acá con sus hermanos para que la definición de «qué es una consulta
 * de mención» tenga un solo lugar.
 */
export const MENTION_QUERY_MAX_WORDS = 4;
