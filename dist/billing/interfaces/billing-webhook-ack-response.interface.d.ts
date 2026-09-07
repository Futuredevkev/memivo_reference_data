/**
 * Lo que el servidor le contesta a una entrega del proveedor de cobro.
 *
 * ── POR QUÉ ES UN TIPO Y NO UN LITERAL EN LA FIRMA DEL HANDLER ────────────
 * Porque el auditor de superficies de transporte marca todo tipo de retorno de
 * controller escrito inline: un `Promise<{ ok: true }>` en la firma es una forma
 * de cable que no tiene nombre y que nadie puede volver a nombrar. Es la misma
 * decisión que ya tomó el acuse del webhook de notificaciones de Apple, que
 * vive al lado de éste por el mismo motivo.
 *
 * ── ES EL RETORNO DEL MÉTODO, NO EL CUERPO DEL CABLE ──────────────────────
 * El envoltorio global de respuestas exitosas lo envuelve antes de salir, así
 * que lo que el proveedor recibe lleva su propia cáscara. Este tipo describe lo
 * que el handler devuelve, y eso alcanza: el proveedor sólo mira el status.
 *
 * ── POR QUÉ NO LO CONSUME EL CLIENTE, Y NO ES DEUDA ───────────────────────
 * Del otro lado de este cable no hay una app: hay un servidor de un tercero. El
 * único consumidor posible es el api, igual que el de Apple.
 */
export interface BillingWebhookAckResponse {
    readonly ok: true;
}
