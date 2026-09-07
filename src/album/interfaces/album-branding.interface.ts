/**
 * LA MARCA DE UN ÁLBUM, tal como se dibuja.
 *
 * Es el logo del estudio más «Entregado por [nombre]», y viaja como UN objeto
 * y no como dos campos sueltos por una razón de significado: **la marca existe
 * o no existe, nunca a medias**. Con dos columnas nullables en la respuesta,
 * un logo sin nombre o un nombre sin logo son estados representables, y el
 * dibujante tendría que decidir qué hacer con ellos — o sea inventar una
 * política que nadie tomó. Acá el único estado de ausencia es `null`.
 *
 * ── EL NOMBRE ES DE UNA PERSONA, Y ESO ES ANCHO ──────────────────────────
 * No hay campo de «nombre de estudio» en el producto: `User` tiene `name` y
 * `lastName` y `UserProfile` no agrega nada parecido. Lo que la marca acredita
 * es el nombre completo de una persona, con lo que eso implica para la caja
 * que lo dibuja — por eso el cliente lo pasa por su política de texto de
 * identidad y no por un `numberOfLines` escrito a mano.
 *
 * ── NO SE DENORMALIZA EL NOMBRE EN LA FILA DEL ÁLBUM ─────────────────────
 * El servidor lo resuelve con `getFullName` sobre la persona acreditada, en la
 * misma consulta que trae el álbum. Guardarlo en `albums` habría creado un
 * segundo dueño del nombre de alguien: el día que esa persona se lo cambia, la
 * portada de todos los álbumes que la acreditan sigue diciendo el viejo, y no
 * hay ningún camino que los actualice. El logo SÍ se denormaliza —es una URL
 * de un archivo que la marca posee, no un dato de la persona—.
 */
export interface AlbumBranding {
  /** La URL del logo, ya resuelta. Si hay marca, hay logo. */
  logoUrl: string;
  /** El nombre completo de la persona acreditada, ya armado por el servidor. */
  deliveredByName: string;
}
