"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOWNLOAD_QUOTA_WINDOW_DAYS = void 0;
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
 * Coincide con {@link ALBUM_QR_CODE_TTL_DAYS}, y no es casualidad: los dos miden
 * lo que dura un evento y su cola.
 */
exports.DOWNLOAD_QUOTA_WINDOW_DAYS = 30;
