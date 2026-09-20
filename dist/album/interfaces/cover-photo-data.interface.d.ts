/**
 * La portada de un álbum o de una carpeta, tal como viaja al cliente.
 *
 * ── NO DECLARA DISPONIBILIDAD, Y ESO ES UNA DECISIÓN MEDIDA ───────────────
 * Heredaba [MediaAvailability] y no podía cumplirlo: los dos helpers que la
 * arman escribían `unavailable: false` FIJO, cada uno con su comentario
 * explicando por qué el suyo estaba bien, y ningún archivo del cliente leía el
 * campo. El tipo prometía «yo te digo si mi imagen todavía existe» sobre un
 * dato que nadie mantenía.
 *
 * La causa está un nivel más abajo: `ALBUM_COVER` está en `false` en
 * [MEDIA_AVAILABILITY_BY_RESOURCE], o sea que la reconciliación de fondo NO
 * sondea las portadas. Leerlas habría devuelto `null` siempre — el mismo
 * `false` fijo, con un `LEFT JOIN` de más en el hot-path de la lista de
 * álbumes, que es justo lo que la denormalización existe para evitar.
 *
 * ── POR QUÉ NO SE ARREGLÓ AL REVÉS, METIENDO LA PORTADA AL BARRIDO ───────
 * Porque el criterio para entrar no es «¿esto es media?» sino **«¿la superficie
 * que lo dibuja ofrecería un reintento imposible, o dejaría un hueco que hay
 * que explicar?»**. Una portada cae a su placeholder: es un dibujo completo y
 * terminado, no un hueco. Decir «esto ya no está» sobre la tarjeta de un álbum
 * alarmaría sin ofrecer ninguna acción, y sondearlas costaría una llamada al
 * proveedor por álbum con portada, para siempre.
 *
 * El día que se decida lo contrario, son DOS movimientos y el gate obliga a
 * hacerlos juntos: meter el recurso al barrido y devolverle el `extends`.
 */
export interface CoverPhotoData {
    url: string | null;
    thumbnailUrl: string | null;
}
