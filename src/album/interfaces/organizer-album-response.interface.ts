import type { OrganizerAlbumListItemResponse } from './organizer-album-list-item-response.interface';

export interface OrganizerAlbumResponse<TTimestamp = string> {
  message: string;
  /**
   * La MISMA forma que emite el listado, sin recortes.
   *
   * Acá había un `Omit<…, 'updated_at'>` sobre una clave que
   * `OrganizerAlbumListItemResponse` ya no declara: un no-op para el
   * compilador y una señal falsa para el lector, que es lo caro. El productor
   * del listado siguió emitiendo `updated_at` durante meses —una clave fuera
   * del contrato— y esta línea era la única huella que hacía pensar que el
   * campo seguía vivo en algún lado. Que ningún `Omit` del paquete vuelva a
   * nombrar una clave inexistente lo mide
   * `omit-does-not-name-a-phantom-key.test.js`.
   */
  album: OrganizerAlbumListItemResponse<TTimestamp>;
}
