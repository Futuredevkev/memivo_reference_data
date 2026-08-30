/**
 * Un host CON dominio de primer nivel: al menos una etiqueta, un punto, y un
 * TLD de dos letras o más.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El campo de LinkedIn del perfil aceptaba un usuario pelado. En el teléfono,
 * `new URL('https://juanperez')` PARSEA —el `URL` que instala el runtime de
 * Expo es el de la especificación, y la especificación admite hosts de una sola
 * etiqueta— así que el gate del cliente daba verde y recién el servidor
 * contestaba 400. El servidor valida el mismo campo con `@IsUrl`, que aplica
 * `require_tld` por defecto: eran dos caminos para la misma regla, y el más
 * permisivo era justamente el que la persona veía.
 *
 * Vive acá por eso: es la misma clase que `INSTAGRAM_HANDLE_REGEX`, que está en
 * este paquete precisamente porque las dos puntas tienen que decidir igual.
 */
export const FQDN_HOST_REGEX =
  /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
