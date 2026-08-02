import type { TimedOperation } from './timed-operation.interface';
/**
 * Núcleo compartido de «acotar una promesa a un tiempo límite». Vivía
 * duplicado a mano en memivo_api (`with-timeout.helper.ts`, con
 * `AbortSignal` + reconciliación post-timeout vía `completion`, usado por
 * los dispatch de push del outbox) y en memivo_client
 * (`utils/with-timeout.ts`, race simple contra un error propio del caller,
 * usado por la compresión de video/imagen) — misma lógica de
 * `Promise.race` + `setTimeout` + limpieza escrita dos veces, ya divergente
 * en la forma de expresar el timeout (firma fija a `OperationTimeoutError`
 * de un lado, factory de error propio del otro). Ficha #172.
 *
 * Publicada acá con la firma MÁS general (tarea abortable que devuelve
 * `TimedOperation`, con el error de timeout inyectado por el caller): cada
 * repo mantiene su propio wrapper local con la firma que sus call-sites ya
 * usan y delega en éste, así ninguno de esos call-sites externos a este
 * paquete tuvo que cambiar de forma para adoptar el contrato compartido.
 */
export declare const withTimeout: <T>(task: (signal: AbortSignal) => Promise<T>, timeoutMs: number, onTimeout: (signal: AbortSignal) => Error) => TimedOperation<T>;
