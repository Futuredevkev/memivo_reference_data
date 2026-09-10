/**
 * CUÁNTOS BYTES puede servirle Memivo a UNA persona dentro de la ventana
 * rodante, sumando TODAS las formas de descarga.
 *
 * ── QUÉ CIERRA, Y NO TIENE NADA QUE VER CON COBRAR ─────────────────────────
 * La validación de acceso de un trabajo de descarga mira ACCESO AL ÁLBUM, no
 * rol: cualquier invitado dispara un job de hasta {@link DOWNLOAD_JOB_MAX_PHOTOS}
 * fotos y lo repite. El throttler global cuenta REQUESTS, y esa ruta convierte
 * UNA request en miles de descargas.
 *
 * ── CIEGA AL PLAN, Y ESO ES LA MITAD DEL DISEÑO ────────────────────────────
 * Es la MISMA para el que paga y el que no. No vende nada: existe para no
 * vender a pérdida. Topear la descarga por plan le pegaría justo a quien viene
 * a buscar sus fotos, que es la promesa del producto.
 *
 * ── POR QUÉ EN BYTES Y NO EN ÍTEMS ─────────────────────────────────────────
 * Porque un ítem no dice cuánto cuesta. En este catálogo la pieza más pesada
 * que puede entrar a una descarga son los 100 MB de un video —el techo de
 * `RESOURCE_UPLOAD_LIMITS` para `GUEST_VIDEO`, `CHAT_VIDEO` y `VIDEO_STORY`— y
 * una foto profesional pesa 15 MB. O sea que el MISMO tope de ítems del
 * manifest ({@link DOWNLOAD_MANIFEST_MAX_ITEMS}) vale entre ~1 GiB y ~19,5 GiB
 * según qué tenga adentro: veinte veces de diferencia por el mismo número de
 * piezas. La factura la paga el byte, así que el freno se pone donde se paga.
 *
 * ── DE DÓNDE SALE EL 8, Y LA PREGUNTA QUE LO ELIGE ─────────────────────────
 * La pregunta que importa NO es «¿cuánto bajaría un usuario legítimo?» —esa
 * vara se acomoda al caso honesto más extremo que uno se pueda imaginar, y así
 * es como un tope termina no topeando nada— sino **«¿cuánto se puede pagar?»**,
 * y ésa la contesta la factura.
 *
 * La factura, mirada el 8 de septiembre de 2026: el plan del proveedor de media
 * es **Free, 25 créditos por mes**, y un crédito es ≈ **1 GB** de tráfico.
 * Contra eso:
 *  · una entrega completa de boda —400 fotos × 15 MB— son **≈ 5,9 GiB**, o sea
 *    el **≈ 24 %** del plan mensual;
 *  · el plan aguanta **≈ 4 descargas completas por mes ENTRE TODOS**.
 *
 * **8 GiB deja pasar una entrega completa entera aunque todas sus fotos sean
 * del máximo**, y corta el desastre.
 *
 * ⚠️ **ES UN FRENO DE ABUSO, NO UN TECHO DE PRODUCTO, Y COMPRA TIEMPO EN VEZ DE
 * RESOLVER.** El plan Free no sostiene la promesa central: 40 invitados bajando
 * el álbum de una boda son ~100 GB, cuatro veces el plan. Lo que lo resuelve es
 * subir el plan del proveedor, y es decisión del dueño.
 *
 * **CON QUÉ INSTRUMENTO SE RETUNEA**: con el contador que crea la misma ola que
 * este número —la tabla `download_byte_usages` del api—, que es el primer lugar
 * del repo donde los bytes servidos por persona quedan registrados. Hasta que
 * ese contador tenga historia, este 8 no se puede corregir contra nada medido, y
 * se dice.
 *
 * ⚠️ **Y HAY UNA SEGUNDA MITAD QUE ESTE NÚMERO NO ARREGLA.** El tope de PIEZAS
 * dejó de ser el que corta: por el camino del job, {@link DOWNLOAD_JOB_MAX_PHOTOS}
 * fotos profesionales son ≈ **73 GiB**, y por el del manifest,
 * {@link DOWNLOAD_MANIFEST_MAX_ITEMS} videos son ≈ **19,5 GiB** — los dos pasan
 * los 8 GiB por lejos, y {@link DOWNLOAD_JOB_MAX_ACTIVE_PER_USER} multiplica el
 * primero por tres. Quien lea esos topes creyendo que acotan el trabajo se va a
 * equivocar: el que acota es éste.
 */
export declare const DOWNLOAD_QUOTA_MAX_BYTES_PER_WINDOW: number;
