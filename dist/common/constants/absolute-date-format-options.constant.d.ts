/**
 * Cómo se escribe una FECHA ABSOLUTA que una persona lee: «15 de julio de 2026».
 *
 * ── EL DEFECTO QUE CIERRA ────────────────────────────────────────────────
 * La fecha hasta la que dura una suspensión se le dice a la misma persona por
 * DOS bocas y en el mismo instante: el cartel de la app —el 403 y el toast del
 * socket— y el mail de suspensión. La app la formateaba con estas tres opciones
 * escritas a mano en `error-handler.ts`; el mail no la decía en absoluto, y al
 * empezar a decirla el número tenía dos caminos para escribirse distinto.
 *
 * Que hoy coincidieran no habría sido garantía de nada: son dos procesos, en
 * dos repos, sin nada que los ate. Por eso el formato viaja por el paquete, que
 * es lo mismo que la casa ya hace con los plazos que dos superficies dicen.
 *
 * ── POR QUÉ ESTAS TRES OPCIONES Y NO OTRAS ──────────────────────────────
 * `month: 'long'` y no `'2-digit'` porque la fecha se lee dentro de una oración
 * y no en una tabla: «hasta el 15/07/2026» obliga a decodificar el orden de los
 * campos, que no es el mismo en los tres idiomas del producto. `day: '2-digit'`
 * para que el ancho no baile entre el 9 y el 10 en una caja que ya está medida
 * al límite. `year: 'numeric'` porque una suspensión puede cruzar el año.
 *
 * ── LO QUE NO DECIDE ─────────────────────────────────────────────────────
 * El idioma. Cada lado le pasa el suyo: la app el del dispositivo o el del
 * perfil, el api el `language` del usuario que guardó el perfil.
 */
export declare const ABSOLUTE_DATE_FORMAT_OPTIONS: Readonly<Intl.DateTimeFormatOptions>;
