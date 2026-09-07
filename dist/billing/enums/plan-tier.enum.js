"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanTier = void 0;
/**
 * El plan de una cuenta, y no hay un tercer valor hoy.
 *
 * ── POR QUÉ ES UN ENUM Y NO UN BOOLEANO `isPro` ────────────────────────────
 * Porque un booleano no tiene dónde crecer sin que cada lector se entere: el
 * día que exista un tercer escalón, `isPro` seguiría compilando en todos lados
 * y decidiendo mal en silencio. Con el enum, `PLAN_LIMITS` es un
 * `Record<PlanTier, …>` y `tsc` obliga a decidir qué le toca al miembro nuevo
 * (ORDEN §6) — que es exactamente la decisión que hay que tomar a conciencia.
 *
 * ── NO ES UN ROL NI UN ESTADO, Y ESO NO ES UN DETALLE ──────────────────────
 * `ValidRoles` viaja FIRMADO en el JWT y es identidad: un derecho revocable por
 * tiempo metido ahí sobrevive en cada access token emitido antes del reembolso.
 * Y `UserStatus` tiene dueño único declarado (el servicio de bans, dentro de la
 * transacción que escribe la suspensión), así que meterle «venció el plan»
 * rompería su invariante y el cron que lo sostiene.
 *
 * El plan se resuelve SIEMPRE contra el instante, leyendo los otorgamientos
 * vivos. No hay columna espejo en `users` a propósito: con espejo, el
 * vencimiento es una escritura que alguien tiene que hacer a tiempo; con
 * instante, si nadie escribe nada el derecho se apaga solo.
 */
var PlanTier;
(function (PlanTier) {
    PlanTier["FREE"] = "FREE";
    PlanTier["PRO"] = "PRO";
})(PlanTier || (exports.PlanTier = PlanTier = {}));
