/**
 * Resultado de correrle el vencimiento al `qrCode` de un álbum.
 *
 * NO rota el código: el mismo `qrCode` sigue sirviendo, con más plazo. Por eso
 * no devuelve ni el código ni el `joinUrl` —no cambiaron— y el que llama no
 * tiene que refrescar nada más que la fecha.
 *
 * Es la contracara del reset y conviene tenerlas juntas en la cabeza: el reset
 * CIERRA puertas —código nuevo, invites revocados, el link viejo deja de
 * resolver— y ésta las mantiene abiertas más tiempo. Nunca las quita: **no
 * existe «sin vencimiento»** (decisión del dueño, 13 ago, por seguridad), así
 * que un código sólo se puede extender, cuantas veces haga falta, y la columna
 * es `NOT NULL` en la base para que eso no dependa de que nadie se distraiga.
 */
export interface AlbumQrCodeExtensionResponse {
  albumId: string;
  /** El vencimiento NUEVO, ya corrido. Nunca es nulo. */
  qrCodeExpiresAt: string;
}
