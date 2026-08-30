"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_ERROR_BODY_KEYS = void 0;
/**
 * Las claves que son PROPIEDAD del envelope de error canónico.
 *
 * Sirve para tres cosas distintas, y por eso vive acá y no en un solo repo:
 *
 * 1. **El api** (`GlobalExceptionFilter` para HTTP, `toWsErrorPayload` para
 *    sockets) le cuelga al sobre, en el mismo nivel, los campos NO canónicos
 *    que ESE `errorCode` tiene autorizados —p.ej.
 *    `registrationChallengeToken` en `AUTH_NOT_VERIFIED`—. Esta lista es la
 *    que NUNCA se pisa con ese reenvío.
 *
 * 2. **El cliente** distingue un {@link ApiSuccessEnvelope} de un
 *    {@link ApiErrorEnvelope} mirando si el objeto trae claves de error. Antes
 *    lo hacía con tres strings escritos a mano
 *    (`!('statusCode' in v) && !('errorCode' in v) && !('path' in v)`), o sea
 *    una tercera copia de esta semántica que ni siquiera estaba completa
 *    (ficha #154).
 *
 * 3. **Define, POR RESTA, cuáles son los campos reenviables**: eso es
 *    {@link ForwardableErrorFields}, y es lo que hace que el punto 1 ya no
 *    necesite filtrar en runtime — un campo autorizado no PUEDE ser canónico,
 *    porque el tipo lo excluye antes de compilar. Mientras esa resta no
 *    existió, la política del api era una segunda lista de nombres escritos a
 *    mano y llegó a divergir del sobre (N-401).
 *
 * Es un array y no un `Set` a propósito: así el tipo conserva los literales,
 * `ApiErrorEnvelope` puede verificarse contra él y la resta del punto 3 tiene
 * de dónde restar. Cada consumidor arma su `Set` si necesita la búsqueda O(1).
 */
exports.RESERVED_ERROR_BODY_KEYS = [
    'success',
    'statusCode',
    'errorCode',
    'message',
    'timestamp',
    'path',
    'error',
];
