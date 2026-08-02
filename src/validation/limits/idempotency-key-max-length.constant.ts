/**
 * Tope de longitud del header `Idempotency-Key` que el api acepta.
 *
 * Es el GEMELO de {@link CLIENT_TEMP_ID_MAX_LENGTH} —el propio docblock del api
 * decía que "es el mismo número, que cumple el mismo rol de clave de
 * idempotencia elegida por el cliente"— y sin embargo quedó api-local cuando se
 * publicó el otro (ficha #111).
 *
 * Acá el argumento pesa MÁS que en el gemelo, no menos. Para el `clientTempId`
 * la fuente de verdad al menos existía: un 400 del servidor. Para éste no hay
 * ninguna. Si la clave se pasa de largo, `IdempotencyInterceptor` la ignora y
 * hace `return next.handle()` EN SILENCIO: la request se procesa igual, sin
 * error, y lo único que se pierde es la idempotencia — o sea que un retry de
 * axios sobre un Network Error vuelve a ejecutar la mutación. Un doble cobro,
 * un doble posteo, y ni una línea en ningún lado.
 *
 * Hoy el cliente manda un `randomUUID()` de 36 caracteres y no se acerca al
 * tope. El día que alguien le agregue un prefijo, esta constante es lo que
 * permite que se entere en su propio repo en vez de en producción.
 */
export const IDEMPOTENCY_KEY_MAX_LENGTH = 128;
