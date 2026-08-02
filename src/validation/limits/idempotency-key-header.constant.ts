/**
 * Nombre canónico del header de idempotencia.
 *
 * Estaba escrito a mano en los dos repos y con DISTINTA capitalización: el api
 * lo busca como `'idempotency-key'` y el cliente lo manda como
 * `'Idempotency-Key'` (ficha #111). Hoy funciona porque los nombres de header
 * HTTP son case-insensitive y Node normaliza a minúsculas lo que entra — o sea
 * que las dos grafías son correctas y ninguna de las dos es verificable contra
 * la otra. Justamente por eso: si alguien renombra el header en un repo, el
 * otro no falla al compilar ni al correr, simplemente deja de haber
 * idempotencia.
 *
 * Se publica en la forma de CABLE (`Idempotency-Key`, capitalizada como la
 * convención HTTP), que es la que el cliente escribe. El api, que LEE de
 * `request.headers` —donde Node ya bajó todo a minúsculas—, tiene que
 * consultarla en minúsculas: ver `IDEMPOTENCY_HEADER` en su barrel, que ahora
 * deriva de ésta con `.toLowerCase()` en vez de repetir el string.
 */
export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';
