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
 * descarga es un archivo de chat de 100 MB y una foto profesional pesa hasta 15
 * MB, así que el mismo número de ítems puede ser un gigabyte o doscientos.
 *
 * ── DE DÓNDE SALE EL 150, Y ES PROVISORIO — SE DICE ────────────────────────
 * Sale de criterio, no de una medición: cuando se escribió, la factura
 * desagregada del proveedor de media no estaba disponible y el egress no se
 * medía en ninguna parte del repo. El criterio fue acotar por arriba el caso
 * honesto más extremo que se pudo construir —alguien que pertenece a varios
 * álbumes con entregas grandes y se las baja en dos dispositivos, unas decenas
 * de gigabytes— y dejar más del doble de aire encima, de modo que el rechazo
 * llegue sólo a quien está pidiendo el techo del sistema en serie.
 *
 * **CON QUÉ INSTRUMENTO SE RETUNEA**, que es lo único que hace honesto a un
 * número provisorio: con el contador que esta misma ola crea. Es el PRIMER
 * lugar del repo donde los bytes servidos por persona quedan registrados; hasta
 * ahora no había ninguno, y por eso este número no se podía derivar de nada.
 * Cuando haya semanas de datos, el techo se corrige contra esa tabla y contra
 * la factura del proveedor — no de memoria, y no acá.
 */
export const DOWNLOAD_QUOTA_MAX_BYTES_PER_WINDOW = 150 * 1024 * MB;
