"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingErrorCode = void 0;
/**
 * Los fallos del COBRO — no los rechazos por plan, que son otra cosa.
 *
 * ── POR QUÉ NO LLEVAN EL PREFIJO `PLAN_`, Y NO ES UNA PREFERENCIA ──────────
 * `PLAN_*` significa «esto se paga», y sale en 402 con un gate que lo sostiene
 * (`plan-rejection-status`). Acá el significado es el CONTRARIO: la persona
 * quiere pagar y el canal de cobro no está disponible. Un 402 sobre eso abriría
 * el paywall encima del paywall, y le diría «pagá» a alguien que justo acaba de
 * apretar «pagar». El prefijo propio es lo que mantiene los dos significados
 * separados, y el costo está declarado: `plan-rejection-status` NO audita este
 * dominio, porque su corpus se define por el prefijo.
 *
 * ── Y NO LLEVAN NINGUNA DE LAS DOS FORMAS QUE EL CLIENTE RECORTA ───────────
 * Ni `…_EXCEEDED` / `…_EXPIRED` (que caerían en `RuleShapedErrorCode` y le
 * pedirían a alguien el número de una regla que acá no existe), ni
 * `…_NOT_FOUND` (que caería en `AbsenceShapedErrorCode` y hablaría con la voz
 * de «esto ya no está» sobre algo que sí está y va a volver). Es un fallo de
 * infraestructura contado como tal, y el cliente lo dice con su propia frase.
 */
var BillingErrorCode;
(function (BillingErrorCode) {
    /**
     * No se pudo abrir el cobro web.
     *
     * ── CUBRE DOS CAUSAS, Y ES A PROPÓSITO ─────────────────────────────────
     * (a) el canal web todavía no está configurado en el servidor —el proveedor
     * de cobro no está dado de alta, que el día que se escribió esto era un
     * bloqueante externo sin resolver—, y (b) el intento no se pudo emitir. Las
     * dos son lo mismo para quien mira la pantalla: apretó «pagar» y no se abrió
     * nada, y en las dos la respuesta útil es la misma —volver a intentar más
     * tarde—. Partirlas en dos códigos daría una frase distinta para una
     * conducta idéntica, y la de (a) tendría que explicar una decisión interna
     * que no es asunto de quien compra.
     *
     * Lo que SÍ las separa es el status: (a) sale 503 y (b) 500, así que el
     * operador las distingue en la métrica sin que la persona lea dos textos.
     *
     * ── NO SE VE CASI NUNCA, Y NO POR ESO ES DEUDA ─────────────────────────
     * El botón de compra sólo se dibuja donde el servidor declaró que el canal
     * está habilitado, así que (a) es inalcanzable por el camino normal. Queda
     * alcanzable por dos vías reales: que la configuración se caiga entre la
     * lectura del plan y el toque del botón, y una llamada directa a la ruta.
     */
    BillingErrorCode["BILLING_CHECKOUT_UNAVAILABLE"] = "BILLING_CHECKOUT_UNAVAILABLE";
})(BillingErrorCode || (exports.BillingErrorCode = BillingErrorCode = {}));
