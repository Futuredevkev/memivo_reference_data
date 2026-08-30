import type { StickerProvider } from '../enums';

/**
 * UN STICKER, EN LA FORMA DE LA CASA. Es lo único que cruza el cable.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * La respuesta cruda del proveedor trae un objeto con MUCHAS renditions, con
 * nombres suyos, tamaños suyos y formatos suyos. Si el cliente eligiera cuál
 * usar pasarían dos cosas malas a la vez:
 *
 *   1. El conocimiento del proveedor se filtraría a la app, y mudarse de
 *      catálogo dejaría de ser una migración de una tabla para convertirse en
 *      una búsqueda por todo el árbol del cliente. Y no se pondría rojo solo:
 *      funcionaría perfecto hasta el día que haya que mudarse.
 *   2. El cliente estaría decidiendo algo que depende del CATÁLOGO y no de la
 *      pantalla, que es el eje equivocado (ORDEN §5).
 *
 * Por eso el proxy NORMALIZA: elige las renditions, arma las URLs y devuelve
 * esta forma. **El cliente no sabe que el proveedor existe**, salvo por la
 * marca que su contrato obliga a mostrar en el selector.
 *
 * ── POR QUÉ VIAJAN DOS URLs Y NO UNA ───────────────────────────────────────
 * Porque la grilla y la burbuja no piden lo mismo, y la diferencia es de un
 * orden de magnitud. Medido contra el CDN del proveedor el 23 de agosto de
 * 2026, sobre un mismo asset: el original pesa 1.476 KB, el ancho de burbuja
 * 260 KB y el de celda 108 KB. Servir el original en una grilla de treinta
 * celdas serían más de cuarenta megas para dibujar un cajón de stickers.
 *
 * ── LO QUE ESTA INTERFAZ NO TRAE, Y ES A PROPÓSITO ─────────────────────────
 * No hay título, ni etiquetas, ni categoría, ni popularidad, ni el término con
 * que se lo encontró. No es que no vengan: es que **guardarlos convertiría el
 * registro de lo que alguien mandó en un ÍNDICE de stickers**, y los términos
 * del proveedor prohíben usar su contenido para construir uno. Lo que se
 * conserva es el mínimo para volver a dibujar un mensaje ya mandado.
 *
 * ── EL ID DE **NUESTRA** FILA NO VIAJA, Y ES A PROPÓSITO ──────────────────
 * Hubo un segundo tipo —`StickerMessageReference`— que era esto más el id de la
 * fila de `stickers`, con el argumento de que en el selector todavía no hay
 * fila —nadie mandó nada— y en un mensaje ya la hay. La distinción es REAL y por eso mismo
 * el campo no puede estar: el catálogo **no puede** completarlo sin insertar una
 * fila por cada sticker que alguien mira, que es a la vez basura en la tabla y
 * lo que los términos del proveedor prohíben —construir un índice de su
 * contenido—. Así que ese campo existía en unas referencias y faltaba en otras,
 * y el cliente tapaba la diferencia con un `as`: la grilla terminaba con la
 * clave de lista y la de reciclado en `undefined`, o sea con stickers
 * apareciendo un instante en la celda de otro al scrollear.
 *
 * A la app no le hace falta nombrar nuestra fila: identifica un sticker por
 * `provider` + `externalId`, y es lo único que manda de vuelta. Quien resuelve
 * la fila es el servidor, que es el único que puede.
 */
export interface StickerReference {
  /** De qué catálogo salió. Viaja porque la fila lo guarda y la clave lo usa. */
  readonly provider: StickerProvider;
  /**
   * El id del sticker EN el catálogo del proveedor.
   *
   * Es la ÚNICA parte que el cliente manda de vuelta para enviar un sticker.
   * No manda las URLs, y esa asimetría es de seguridad: una URL declarada por
   * el cliente es una URL que todo el chat va a cargar, así que el servidor
   * las DERIVA de este id en vez de creerle a nadie.
   */
  readonly externalId: string;
  /** La que dibuja la burbuja. */
  readonly url: string;
  /** La liviana, para la celda de la grilla del selector. */
  readonly previewUrl: string;
  /**
   * El primer frame QUIETO, cuando el proveedor lo ofrece.
   *
   * No es una tercera calidad: es la salida cuando animar sale caro —una
   * grilla larga, un teléfono viejo, o el defecto de renderizado de WebP
   * animado que todavía no se pudo descartar—. Medido: pesa una fracción del
   * animado del mismo asset.
   *
   * `null` cuando el sticker no se mueve: ahí `previewUrl` YA es un cuadro
   * quieto y una segunda URL igual sería una copia (ORDEN §1).
   */
  readonly stillUrl: string | null;
  /**
   * Medidas que el catálogo declara para el asset.
   *
   * El servidor las conserva como metadata de la fila y las vuelve a entregar
   * con la referencia normalizada. La app las pasa a la fuente para que la
   * imagen conozca su proporción antes de bajar; la caja la fija el host, así
   * que estas medidas describen el contenido y no el tamaño de esa caja.
   */
  readonly width: number;
  readonly height: number;
  /**
   * Se mueve.
   *
   * Lo guarda la fila porque es una propiedad del asset y no de quien lo mira.
   * El cliente no decide una rendition con esta bandera: recibe `stillUrl` ya
   * resuelta y sólo elige si quiere dibujar quieto. Por eso el auditor declara
   * explícitamente que este campo tiene un lector del servidor y no de la app.
   * NO es lo que separa un sticker de un GIF —eso es el fondo transparente—;
   * es sólo si hay animación que dibujar.
   */
  readonly isAnimated: boolean;
}
