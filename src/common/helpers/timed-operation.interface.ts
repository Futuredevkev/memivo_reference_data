/**
 * Resultado de `withTimeout`: el presupuesto de pared del caller y el
 * trabajo real quedan separados a propósito. Cancelar en SDKs de terceros
 * (compresión de video/imagen, requests salientes) es COOPERATIVO — el
 * `AbortSignal` es sólo una señal, no una garantía de corte inmediato — así
 * que un caller durable no puede asumir que el timeout significa que nada
 * fue entregado. `result` es lo que se espera con `await`; `completion` es
 * la promesa de la tarea real, para reconciliar si sigue viva después de
 * que `result` ya rechazó por timeout.
 */
export interface TimedOperation<T> {
  /** Presupuesto de pared del caller. */
  result: Promise<T>;
  /** Trabajo real: puede resolver después del timeout y debe reconciliarse. */
  completion: Promise<T>;
}
