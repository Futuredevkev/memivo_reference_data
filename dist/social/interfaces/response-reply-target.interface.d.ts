import type { SocialAuthor } from './social-author.interface';
/**
 * La respuesta a la que otra respuesta contesta: lo justo para dibujar «en
 * respuesta a María» y saltar hasta ella.
 *
 * `user` es un `SocialAuthor` —la misma forma y la misma puerta de identidad
 * que el autor de la fila— y no una forma más angosta: una segunda forma sería
 * un segundo camino para proyectar identidad, y el rol del álbum del citado
 * entra en la misma lectura en lote que el de los autores de la página.
 *
 * Sin el texto de la citada, a propósito: la etiqueta nombra a la persona, no
 * cita lo que dijo. Cuando la citada está en pantalla ya se lee; cuando no, el
 * salto la trae con su contexto.
 */
export interface ResponseReplyTarget {
    id: string;
    user: SocialAuthor;
}
