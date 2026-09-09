/**
 * La marca de que una pieza de media YA NO ESTÁ.
 *
 * ── EL DEFECTO QUE CIERRA ────────────────────────────────────────────────────
 * El cliente no puede distinguir un asset borrado para siempre de un parpadeo
 * de red: `expo-image` sólo entrega `{ error: string }` en su `onError`, sin
 * status ni código. Con esa materia prima, la app dibujaba la MISMA tarjeta para
 * los dos casos —«Algo salió mal» con un botón «Reintentar»— y sobre un 404 ese
 * botón promete una recuperación que no existe: reintentar un 404 da 404 hoy,
 * mañana y siempre.
 *
 * El servidor SÍ puede saberlo, así que la decisión vuelve a donde corresponde
 * (el cliente no toma responsabilidad que no le toca) y viaja como un HECHO, no
 * como una instrucción de dibujo: acá se dice que la pieza no está, y qué se
 * dibuja con eso lo decide cada superficie.
 *
 * ── POR QUÉ OPCIONAL Y SÓLO `true` ──────────────────────────────────────────
 * Porque la ausencia es el caso raro y el campo viaja en TODA pieza de media de
 * TODA respuesta: un booleano requerido pagaría bytes en cada foto de cada
 * página de feed para decir «esta está bien», que es lo que ya significa que la
 * url funcione. Ausente es «no hay nada que declarar»; presente es el hecho.
 * `false` no existe a propósito: no habría forma de distinguirlo de «este
 * servidor todavía no sabe», y son cosas distintas.
 *
 * ── POR QUÉ NO DICE LA CAUSA, Y ESO NO ES UN OLVIDO ─────────────────────────
 * Un mensaje distinto según la causa DELATA EL BLOQUEO: «no existe» frente a
 * «existe pero no podés verlo» es justamente el dato que no hay que dar. El
 * cliente colapsa todas las causas de ausencia en un solo texto, así que la
 * causa no sólo no hace falta: no debe viajar.
 *
 * ── LO QUE NO EXPRESA ───────────────────────────────────────────────────────
 * Que la pieza esté BIEN. La ausencia de la marca significa «nadie declaró que
 * falte», no «se verificó que está»: la verificación corre fuera del request y
 * puede no haber llegado todavía a esa fila. Quien dibuje tiene que tratar la
 * ausencia de marca como el caso normal, nunca como una garantía.
 */
export interface MediaAvailability {
    /**
     * Presente y en `true` cuando el servidor confirmó que el asset ya no existe
     * en el almacenamiento. Ausente en cualquier otro caso.
     */
    unavailable?: true;
}
