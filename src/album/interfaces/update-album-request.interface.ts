export interface UpdateAlbumRequest {
  title?: string;
  /**
   * `null` VACÍA la descripción; omitirla la deja como está (bloque 36, H-067).
   *
   * Antes sólo existían dos estados en el cable —presente o ausente— y el
   * cliente convertía el campo vacío en `undefined`, así que la clave no
   * viajaba y el `Object.assign` del servidor conservaba el valor viejo: borrar
   * una descripción era imposible por construcción, con la UI diciendo que se
   * había guardado.
   */
  description?: string | null;
}
