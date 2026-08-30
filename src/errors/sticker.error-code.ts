/**
 * Códigos de error del catálogo de stickers.
 *
 * Los dos primeros separan dos fallas que un usuario vive distinto y que un
 * `500` genérico colapsaba en una sola: «el catálogo no contesta» —transitorio,
 * se reintenta— y «se acabó la cuota de la hora» —transitorio también, pero con
 * otro plazo y otra explicación—. Colapsarlas obligaría a la app a inventar cuál
 * fue para elegir qué decir, que es decidir dos veces lo que el servidor ya
 * sabe.
 */
export enum StickerErrorCode {
  /**
   * El catálogo no contestó: cayó, tardó de más o devolvió algo que no se pudo
   * leer. Reintentable ya.
   */
  STICKER_CATALOG_UNAVAILABLE = 'STICKER_CATALOG_UNAVAILABLE',
  /**
   * Se agotó la cuota de llamadas de la ventana actual.
   *
   * Es distinto del anterior: el catálogo está sano y lo que falta es
   * presupuesto. Reintentable, pero no en el mismo segundo.
   */
  STICKER_CATALOG_QUOTA_EXCEEDED = 'STICKER_CATALOG_QUOTA_EXCEEDED',
  /**
   * El sticker que se quiso mandar no existe en el catálogo.
   *
   * Llega cuando el `externalId` no tiene forma de id, o cuando el catálogo ya
   * no lo tiene. Es 400 y no 500: lo que está mal es lo que se pidió.
   */
  STICKER_NOT_FOUND = 'STICKER_NOT_FOUND',
  /**
   * Se quiso EDITAR contenido cuyo cuerpo es un sticker.
   *
   * Editar es reescribir el texto, y una fila de sticker no tiene texto. Es un
   * código propio y no un `..._FORBIDDEN` de cada superficie porque el motivo
   * no es de permisos: no cambia con quién pregunta, el autor tampoco puede.
   * Decirlo con el código de permiso haría que la app explicara «no es tuyo»
   * sobre algo que sí lo es.
   *
   * Lo emiten las TRES superficies de texto-o-sticker —comentario, respuesta y
   * comentario de historia— desde la misma puerta,
   * `isStickerContentEditable`.
   */
  STICKER_CONTENT_NOT_EDITABLE = 'STICKER_CONTENT_NOT_EDITABLE',
}

/**
 * ── LO QUE ESTE CATÁLOGO **NO** DECLARA, Y POR QUÉ ────────────────────────
 * Hubo un cuarto código, `STICKER_CONTENT_SHAPE_INVALID`, para «mandaste texto
 * y sticker a la vez, o ninguno de los dos». Se sacó ANTES de publicarse porque
 * **no tenía emisor**: esa forma la rechaza el validador del DTO en el borde
 * —con su propio mensaje— y el `CHECK` de la tabla como backstop, y ninguno de
 * los dos emite un código del paquete.
 *
 * Declararlo igual habría sido superficie muerta con forma de contrato: un
 * código que la app podría empezar a manejar y que el servidor no manda nunca.
 * El día que ese rechazo necesite un código propio, vuelve CON su emisor.
 *
 * El contraste está a diez renglones: `STICKER_CONTENT_NOT_EDITABLE` entró
 * junto con los tres emisores que lo lanzan y el gate de la app que lo lee.
 */
