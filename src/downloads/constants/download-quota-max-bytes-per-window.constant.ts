import { MB } from '../../media/constants/mb.constant';

/**
 * CUÁNTOS BYTES puede servirle Memivo a UNA persona dentro de la ventana
 * rodante, sumando TODAS las formas de descarga.
 *
 * ── QUÉ CIERRA, Y NO TIENE NADA QUE VER CON COBRAR ─────────────────────────
 * Es un agujero de costo REAL, con o sin planes. La validación de acceso de un
 * trabajo de descarga mira ACCESO AL ÁLBUM, no rol: cualquier invitado dispara
 * un job de hasta `DOWNLOAD_JOB_MAX_PHOTOS` fotos y lo repite. El throttler
 * global cuenta REQUESTS, y esa ruta convierte UNA request en miles de
 * descargas, así que no la acota. Contando el techo de ítems que hoy se
 * permite, una sola cuenta puede pedir cientos de gigabytes.
 *
 * ── CIEGA AL PLAN, Y ESO ES LA MITAD DEL DISEÑO ────────────────────────────
 * Es la MISMA para el que paga y el que no. No vende nada: existe para no
 * vender a pérdida. Topear la descarga por plan le pegaría a quien viene a
 * buscar sus fotos —que es quien nunca paga y nunca debería pagar— y dejaría
 * intacto al organizador, que no descarga nada porque él las subió.
 *
 * ── POR QUÉ EN BYTES Y NO EN ÍTEMS ─────────────────────────────────────────
 * Porque un ítem no dice nada de la factura. La pieza más pesada del camino de
 * descarga es un video profesional —500 MB, el techo de
 * `RESOURCE_UPLOAD_LIMITS[PROFESSIONAL_VIDEO].maxFileSize`—, el archivo de chat
 * es el segundo con 100 MB y una foto profesional pesa hasta 15 MB, así que el
 * mismo número de ítems puede ser un gigabyte o dos teras.
 *
 * ── DE DÓNDE SALE EL 8, Y LA PREGUNTA QUE LO ELIGE ─────────────────────────
 * El número anterior —250 GiB— salió de una pregunta que no era la que había
 * que hacer: **«¿cuánto bajaría un usuario legítimo?»**. Con esa vara el techo
 * se acomoda al caso honesto más extremo que uno se pueda imaginar, y el
 * resultado fue un tope que no protege nada. La pregunta correcta es
 * **«¿cuánto se puede pagar?»**, y ésa se contesta con la factura, no con la
 * imaginación.
 *
 * La factura, mirada el 8 de septiembre de 2026: el plan del proveedor de media
 * es **Free, 25 créditos por mes**, y un crédito es aproximadamente **1 GB** de
 * tráfico. Contra eso:
 *
 *  · 250 GiB ≈ 250 créditos ≈ **diez veces el plan entero**, para UNA persona,
 *    en UNA ventana. O sea que el tope viejo no era un tope: quien lo chocara
 *    ya habría fundido el mes diez veces.
 *  · una entrega completa de boda —400 fotos × 15 MB— son **≈ 5,9 GiB**, que es
 *    el **≈ 24 %** del plan mensual.
 *  · o sea que el plan aguanta **≈ 4 descargas completas por mes ENTRE TODOS**.
 *
 * **8 GiB deja pasar una entrega completa entera aunque todas sus fotos sean
 * del máximo**, y corta el desastre: un solo job de 5.000 piezas servidas tal
 * cual son ~25 GB —el mes entero en un toque—, y `MAX_ACTIVE_PER_USER` lo
 * multiplica por tres.
 *
 * ⚠️ **ES UN FRENO DE ABUSO, NO UN TECHO DE PRODUCTO, Y COMPRA TIEMPO EN VEZ
 * DE RESOLVER.** La cuenta honesta es que **el plan Free no sostiene la promesa
 * central del producto**: 40 invitados bajando el álbum de una boda son ~100 GB,
 * o sea 4× el plan. Ninguna constante arregla eso. **Lo que lo resuelve es subir
 * el plan del proveedor**, y es decisión del dueño para cuando entre gente;
 * hasta entonces este número evita que una sola cuenta se lleve el mes.
 *
 * **CON QUÉ INSTRUMENTO SE RETUNEA**, que es lo único que hace honesto a un
 * número elegido contra una factura de hoy: con el contador que la ola 1 creó
 * (`download_byte_usages`), que es el primer lugar del repo donde los bytes
 * servidos por persona quedan registrados. Cuando el plan del proveedor suba,
 * el techo sube con él **contra esa tabla y contra la factura nueva** — no de
 * memoria, y no acá.
 *
 * ⚠️ **Y hay una segunda mitad que este número no arregla**: con el tope de
 * piezas por trabajo en 5.000, un job de puro video pide 2,4 TiB y lo rechaza
 * esta cuota, no aquél. El rechazo es correcto —el pre-check pesa la selección
 * ANTES de materializar nada— pero significa que el tope de PIEZAS dejó de ser
 * el que corta, y quien lo lea creyendo que acota el trabajo se va a equivocar.
 */
export const DOWNLOAD_QUOTA_MAX_BYTES_PER_WINDOW = 8 * 1024 * MB;
