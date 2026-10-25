/**
 * CUÁNTOS avisos puede mandar un álbum dentro de la ventana móvil de
 * {@link ALBUM_ANNOUNCEMENT_WINDOW_HOURS}.
 *
 * ── POR QUÉ HACE FALTA ADEMÁS DEL INTERVALO ──────────────────────────────
 * El intervalo sólo separa los avisos; no pone techo. Con 30 minutos entre
 * uno y otro, un álbum podría mandar 48 por día y cada invitado los recibiría
 * todos. Éste es el techo.
 *
 * ── POR QUÉ 6 ─────────────────────────────────────────────────────────────
 * Alcanzan para un evento largo contado en sus momentos: ceremonia, cena,
 * vals, torta, fotos y cierre. Un séptimo ya no es un momento del evento, es
 * ruido. Es antispam, no de negocio: en la línea de producción es gratis.
 */
export declare const ALBUM_ANNOUNCEMENT_MAX_PER_WINDOW = 6;
