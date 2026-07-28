/**
 * Aviso de que el set de identidades ocultas del receptor cambió.
 *
 * El bloqueo es bidireccional para visibilidad, así que cuando A bloquea a B
 * los DOS tienen que dejar de verse. El cliente resuelve eso con un set local
 * (`useBlockedIdsStore`) que hasta ahora sólo se re-hidrataba al `connect()`
 * del socket: con la app en primer plano —justo cuando la conversación está
 * caliente y alguien decide bloquear— el otro lado seguía recibiendo cada
 * mensaje nuevo en vivo, y un pull-to-refresh contra el REST filtrado los hacía
 * desaparecer. El resultado era incoherente consigo mismo.
 *
 * El payload NO lleva la lista: sólo dice «volvé a pedirla». Mandarla por el
 * cable la duplicaría como fuente de verdad y ataría el tamaño del frame al
 * tamaño del set.
 */
export interface HiddenIdsChangedPayload {
    /** Qué lo disparó. Informativo: el cliente re-hidrata igual en los dos casos. */
    reason: 'blocked' | 'unblocked';
}
