/**
 * Un compartir en vivo dejó de transmitir para quien recibe este evento.
 *
 * ── NO DICE POR QUÉ, Y ESO ES LA DECISIÓN ──────────────────────────────────
 * Las tres causas son: quien comparte lo cortó, se venció el plazo, o apareció
 * un bloqueo entre las dos personas. Mandar la causa delataría el bloqueo —«se
 * cortó» frente a «te bloqueó» es justo la información que el vocabulario de
 * «esto ya no está» existe para no dar— así que las tres llegan iguales y la
 * burbuja muestra lo mismo.
 *
 * ── POR QUÉ ES POR MENSAJE Y NO POR GRUPO ──────────────────────────────────
 * Porque un bloqueo corta el compartir para UNA persona y no para la sala: el
 * resto del grupo lo sigue viendo. El evento tiene que poder entregarse a un
 * solo destinatario, y para eso alcanza con el id del mensaje.
 */
export interface ChatLiveLocationEndedPayload {
    messageId: string;
}
