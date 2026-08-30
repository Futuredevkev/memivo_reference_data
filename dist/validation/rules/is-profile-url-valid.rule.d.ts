/**
 * ¿ES UNA URL DE PERFIL VÁLIDA? La misma respuesta para las dos puntas.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Esta regla estaba escrita dos veces y no decían lo mismo. El cliente parseaba
 * con `new URL` y sólo miraba el protocolo; el servidor usaba `@IsUrl`, que
 * exige TLD por defecto. Así, `juanperez` pasaba el gate del formulario —el
 * `URL` de la especificación admite hosts de una sola etiqueta— y el 400 llegaba
 * después de mandar. El más permisivo era justamente el que la persona veía.
 *
 * ── EL VACÍO ES VÁLIDO, Y ES DELIBERADO ───────────────────────────────────
 * Todos los campos que usan esta regla son OPCIONALES. Quien necesite que además
 * esté presente lo combina con su propio chequeo de requerido; meterlo acá
 * obligaría a cada campo opcional a rodear la regla, que es como se termina
 * teniendo dos.
 */
export declare const isProfileUrlValid: (value: string) => boolean;
