import type { PlanTier } from '../enums';

/**
 * EL PLAN DE UNA PERSONA, TAL COMO VIAJA PEGADO A SU IDENTIDAD.
 *
 * ── QUÉ DEFECTO CIERRA ────────────────────────────────────────────────────
 * El dueño decidió (13 sep 2026) que quien paga lleva un tick de verificado al
 * lado del nombre, en toda superficie donde aparece una persona. Las formas de
 * persona del contrato son una por dominio —el autor de un post, el de una
 * historia, el integrante de un chat, el invitado de un álbum…— y no comparten
 * base. Escribir `planTier` en cada una habría sido N copias del mismo campo:
 * la que se olvide es la superficie donde el tick no aparece, y nada lo avisa.
 * Nace UNA vez, acá, y cada forma lo EXTIENDE.
 *
 * ── POR QUÉ ES EL TIER Y NO UN BOOLEANO ───────────────────────────────────
 * Por lo que dice {@link PlanTier}: un `isPro` no tiene dónde crecer sin que
 * cada lector se entere. Qué escalones llevan la marca lo decide el cliente con
 * una tabla TOTAL sobre el enum, que no compila hasta que alguien decida qué le
 * toca a un escalón nuevo.
 *
 * ── POR QUÉ ES OBLIGATORIO ────────────────────────────────────────────────
 * Opcional, un productor del servidor que se olvide de pedirlo compilaría y
 * mandaría la ausencia —que el cliente leería como «no paga»—. Obligatorio,
 * `tsc` encuentra cada productor que falta. `FREE` es un valor, no la falta de
 * uno.
 *
 * ── NO ES AUTORIDAD ───────────────────────────────────────────────────────
 * Sirve para DIBUJAR. Nadie decide nada con esto: el derecho se resuelve en el
 * servidor contra el instante. Y puede quedar hasta un TTL de caché atrasado
 * cuando el plan vence solo, porque el vencimiento natural no escribe nada: el
 * número exacto de esa ventana lo declara el servidor, donde vive la caché.
 */
export interface UserPlanTier {
  planTier: PlanTier;
}
