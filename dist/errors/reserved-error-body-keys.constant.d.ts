/**
 * Las claves que son PROPIEDAD del envelope de error canónico.
 *
 * Sirve para dos cosas distintas, y por eso vive acá y no en un solo repo:
 *
 * 1. **El api** (`GlobalExceptionFilter`) reenvía al cliente, en el mismo nivel,
 *    cualquier campo NO canónico que traía el payload de la excepción original
 *    —p.ej. `registrationChallengeToken` en `AUTH_NOT_VERIFIED`—, en vez de
 *    tragárselo. Esta lista es la que NUNCA se pisa con ese reenvío.
 *
 * 2. **El cliente** distingue un {@link ApiSuccessEnvelope} de un
 *    {@link ApiErrorEnvelope} mirando si el objeto trae claves de error. Antes
 *    lo hacía con tres strings escritos a mano
 *    (`!('statusCode' in v) && !('errorCode' in v) && !('path' in v)`), o sea
 *    una tercera copia de esta semántica que ni siquiera estaba completa
 *    (ficha #154).
 *
 * Es un array y no un `Set` a propósito: así el tipo conserva los literales y
 * `ApiErrorEnvelope` puede verificarse contra él. Cada consumidor arma su `Set`
 * si necesita la búsqueda O(1).
 */
export declare const RESERVED_ERROR_BODY_KEYS: readonly ["success", "statusCode", "errorCode", "message", "timestamp", "path", "error"];
export type ReservedErrorBodyKey = (typeof RESERVED_ERROR_BODY_KEYS)[number];
