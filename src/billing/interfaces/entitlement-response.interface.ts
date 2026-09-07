import type { PlanTier } from '../enums/plan-tier.enum';

/**
 * Lo que el servidor contesta cuando el cliente pregunta qué plan tiene.
 *
 * ── POR QUÉ VIAJA EL TIER Y NO LOS TOPES ───────────────────────────────────
 * Porque los topes ya viajan: `PLAN_LIMITS` es del contrato y los dos lados lo
 * leen del mismo pin. Mandarlos en la respuesta sería una segunda copia que se
 * desincroniza con el cliente viejo, y además haría que el cliente creyera que
 * el número es negociable por respuesta.
 *
 * ── POR QUÉ NO VIAJA `expiresAt` ───────────────────────────────────────────
 * Porque hoy no lo lee nadie, y un payload con campos que nadie lee es deuda
 * (ORDEN §7). El aviso de vencimiento es otra ola y tiene su propio canal —una
 * notificación—: cuando llegue, este campo entra con su consumidor.
 *
 * ── ESTO ES CACHÉ DE CONVENIENCIA, NUNCA AUTORIDAD ─────────────────────────
 * Sirve para que la pantalla dibuje rápido y para no hacerle perder el tiempo a
 * quien va a chocar un tope. NO autoriza: el servidor vuelve a resolver el plan
 * en cada operación que lo necesita, y ningún endpoint acepta el plan desde el
 * cliente.
 */
export interface EntitlementResponse {
  readonly tier: PlanTier;
  /**
   * Cuántos álbumes creó esta cuenta MIENTRAS NO TENÍA PLAN ACTIVO.
   *
   * Viaja porque el modelo lo exige con todas las letras: el contador se
   * MUESTRA antes de cualquier rechazo. Sin él, la única forma de enterarse del
   * cupo sería chocarlo — y en la pantalla de crear un álbum eso significa
   * perder lo que ya se escribió.
   *
   * No es un dato de autoridad: el servidor lo vuelve a leer, bajo lock, cada
   * vez que decide si se puede crear.
   */
  readonly albumsCreatedWhileFree: number;
}
