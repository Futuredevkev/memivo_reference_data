/**
 * CUÁNTOS DÍAS bloquea una denuncia de perfil a la siguiente sobre la misma
 * persona.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * De los diez plazos que la app le puede nombrar a una persona, éste es el
 * ÚNICO cuyo número cambia la conducta: mientras corre, no se puede volver a
 * denunciar a la misma cuenta. Y la frase que lo anunciaba decía otra cosa —«Esperá
 * a que moderación revise tu reporte anterior»— sobre un predicado que no mira
 * el estado del reporte: moderación puede haberlo cerrado y la ventana sigue
 * corriendo igual. La app mandaba a esperar un hecho que no destraba nada y que,
 * además, ninguna superficie le cuenta a la persona.
 *
 * Se publica porque la frase lo tiene que DECIR, y el número tiene que salir del
 * mismo lugar que lo aplica. Escrito a mano del lado del cliente sería la misma
 * clase de copia que ya se pagó dos veces con el QR y con el view-once.
 *
 * ── POR QUÉ EN DÍAS ───────────────────────────────────────────────────────
 * Porque el DÍA es la unidad en la que la ventana se decide y se dice. Los
 * milisegundos son cómo el servidor la aplica, y eso lo deriva él a partir de
 * acá.
 *
 * ── POR QUÉ 7 DÍAS ────────────────────────────────────────────────────────
 * Es el balance escrito del lado del servidor: permitir denuncias legítimas tras
 * un cambio de conducta sin dejar abierto el ataque de spam masivo. El eje es el
 * TIEMPO y no el estado del reporte a propósito — «cerrado desbloquea» abre el
 * loop de descartar y volver a denunciar sin techo.
 */
export const PROFILE_REPORT_DUPLICATE_WINDOW_DAYS = 7;
