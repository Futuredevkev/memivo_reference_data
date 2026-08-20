import type { ApiErrorEnvelope } from './api-error-envelope.interface';
import type { ReservedErrorBodyKey } from './reserved-error-body-keys.constant';
/**
 * La parte NO canónica del sobre de error: los campos que un `errorCode`
 * puntual le cuelga a SU respuesta, y ninguno más.
 *
 * ── EL DEFECTO QUE CIERRA (N-401) ─────────────────────────────────────────
 * Estos campos —hoy `isPermanent`, `expiresAt` y `registrationChallengeToken`—
 * viajaban del api al cliente adentro de un `Record<string, unknown>` que
 * `GlobalExceptionFilter` esparcía en el literal del sobre. Tres consecuencias,
 * y las tres mudas: el compilador no podía ver los campos, porque una bolsa sin
 * tipar satisface cualquier opcional; una clave con typo se publicaba sola,
 * porque el reenvío copia por NOMBRE desde el cuerpo de la excepción y nadie
 * comparaba ese nombre contra el contrato; y la política que autorizaba el
 * reenvío era una SEGUNDA lista para el mismo concepto, que ya había divergido
 * —autorizaba `registrationChallengeToken` mientras {@link ApiErrorEnvelope} no
 * lo declaraba, o sea que el api publicaba un campo que el sobre negaba tener—.
 *
 * ── POR QUÉ ES UNA DERIVACIÓN Y NO UNA LISTA ──────────────────────────────
 * Escribir estos nombres a mano en algún lado sería la MISMA falla otra vez: un
 * tercer lugar decidiendo qué campos tiene el sobre. Salen de restarle al sobre
 * las claves que {@link ReservedErrorBodyKey} declara propiedad suya, así que
 * el conjunto no puede discrepar de la interfaz ni por un typo ni por olvido.
 *
 * ── QUIÉN LO USA, Y QUÉ SE PONE ROJO ──────────────────────────────────────
 * Del lado del api, `FORWARDABLE_ERROR_BODY_FIELDS` se llavea por
 * `keyof ForwardableErrorFields`, o sea que es un `Record` TOTAL: sumarle un
 * campo opcional al sobre y no decir qué `errorCode` puede publicarlo deja esa
 * constante en rojo. Es lo que hace que agregar un campo al sobre no se pueda
 * hacer a medias. Y los dos emisores —el filtro HTTP y el armador de payload de
 * sockets— reciben y devuelven ESTE tipo en vez de la bolsa.
 */
export type ForwardableErrorFields = Omit<ApiErrorEnvelope, ReservedErrorBodyKey>;
