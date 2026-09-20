/**
 * El rango válido de un minuto-del-día de la ventana diaria: `0` es 00:00 y
 * `1439` es 23:59. Cerrado en los dos extremos.
 *
 * ── POR QUÉ VIVE EN EL CONTRATO Y NO EN CADA PUNTA ────────────────────────
 * Porque el rango lo verifican TRES escritores independientes —el `CHECK` de la
 * tabla, el DTO del endpoint del organizador, y el selector de la app— y ésa es
 * la definición de un número que tiene que salir de un solo lugar. Con el 1439
 * escrito a mano en tres archivos, correr el extremo un minuto significa
 * acordarse de los tres, y el que se olvida no rompe nada: acepta un valor que
 * el `CHECK` rechaza, o rechaza uno que la base acepta.
 *
 * ── POR QUÉ LOS DOS EXTREMOS SON UN SOLO SÍMBOLO ──────────────────────────
 * Porque un mínimo sin su máximo no es un límite: lo que se consume siempre es
 * el rango entero, y partirlo en dos constantes dejaría dos archivos que hay
 * que acordarse de leer juntos.
 *
 * ── POR QUÉ NO ES `MINUTES_PER_DAY` ───────────────────────────────────────
 * Ese símbolo existe a los dos lados del cable y **a propósito no viaja por el
 * contrato**: un día tiene 1440 minutos en los dos procesos, es aritmética y no
 * una decisión de producto, y su docblock del cliente lo deja escrito. Esto es
 * otra cosa: es el DOMINIO ADMITIDO de una columna, que sí es decisión del
 * producto y sí tiene que viajar. Que los dos números se toquen —1439 es
 * 1440 − 1— no los vuelve el mismo símbolo; ésa es justo la coincidencia
 * numérica que termina «unificando» dos dominios por parecido.
 */
export declare const ALBUM_POSTING_MINUTE_RANGE: {
    readonly min: 0;
    readonly max: 1439;
};
