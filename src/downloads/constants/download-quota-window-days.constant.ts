/**
 * CUÁNTOS DÍAS mira hacia atrás la cuota de bytes de descarga.
 *
 * ── POR QUÉ RODANTE Y NO UN CICLO FIJO ─────────────────────────────────────
 * Un ciclo fijo —«del 1 al 30 de cada mes»— regala el peor caso justo en el
 * borde: quien agota su cuota el día 30 la tiene entera de nuevo el 31, así que
 * el abuso se hace dos veces en dos días. La ventana rodante no tiene borde que
 * esperar: cada byte pesa exactamente los días que dice esta constante y después
 * deja de pesar, sin que nadie tenga que correr un reinicio.
 *
 * Y no hace falta un cron para vaciarla, que es la otra mitad: la suma se
 * calcula con un `WHERE` sobre la fecha, así que no hay estado que resetear ni
 * un barrido que pueda quedar sin correr.
 *
 * ── POR QUÉ 30 DÍAS ────────────────────────────────────────────────────────
 * Porque es el plazo con el que factura el proveedor de media, y la cuota existe
 * para no gastar más de lo que el plan aguanta: medir en otra ventana obligaría a
 * traducir entre dos plazos para saber si el número alcanza.
 *
 * ⚠️ **Coincide con {@link ALBUM_QR_CODE_TTL_DAYS} POR CASUALIDAD, y conviene
 * saberlo antes de derivar uno del otro.** Los dos valen 30 por ejes DISTINTOS, y
 * cada archivo declara el suyo: aquél mide lo que dura un evento y su cola de
 * subidas; éste, el ciclo con el que factura el proveedor de media. El día que se
 * cambie el plan del proveedor, este número se mueve y el del QR NO — y al revés.
 * Escribir uno en función del otro ataría dos decisiones que no tienen nada que
 * ver, que es la clase de acople que después nadie puede desarmar.
 */
export const DOWNLOAD_QUOTA_WINDOW_DAYS = 30;
