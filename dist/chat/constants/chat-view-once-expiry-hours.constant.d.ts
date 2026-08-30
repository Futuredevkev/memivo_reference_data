/**
 * CUÁNTAS HORAS vive el contenido de un mensaje de una sola vista antes de que
 * el servidor lo borre, lo haya visto alguien o no.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El plazo lo aplicaba el servidor desde su propia constante, y el cliente lo
 * tenía TIPEADO A MANO en dos textos del MISMO flujo de envío, escritos de dos
 * formas distintas: uno decía «expira en 24h» —pegado, contra la convención que
 * el propio locale declara para los símbolos— y el otro «Expira a las 24
 * horas», que en castellano se lee como una hora del reloj y no como un lapso.
 * Tres escrituras del mismo número, y ninguna de las dos del cliente se
 * enteraría si el servidor cambiara la ventana.
 *
 * ── POR QUÉ EN HORAS ──────────────────────────────────────────────────────
 * Porque es la unidad en la que el plazo se dice y se decide. El cron lo aplica
 * restándoselas a un `Date`; la app lo escribe con su propio formateador de
 * duraciones, que recibe minutos y elige la unidad. Los dos derivan de acá.
 */
export declare const CHAT_VIEW_ONCE_EXPIRY_HOURS = 24;
