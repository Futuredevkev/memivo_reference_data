/**
 * POR QUÉ el álbum no admite publicaciones de los invitados ahora mismo.
 *
 * ── POR QUÉ LO DICE EL RESOLVEDOR Y NO LO DEDUCE CADA LECTOR ──────────────
 * Se puede deducir del modo más el próximo borde —`ONE_SHOT` sin próximo borde
 * es «ya se cerró»—, y ésa es justamente la deducción que no hay que repetir:
 * la haría el cliente para elegir la frase, el sobre del error para decir qué
 * pasó, y el día que entre un modo nuevo las dos se olvidarían de él sin que
 * nada rompa. Quien evalúa la ventana ya sabe la respuesta; que la diga.
 *
 * ── Y POR QUÉ NO HAY UN BOOLEANO AL LADO ──────────────────────────────────
 * «Abierto para todos» es exactamente `closedReason === null`. Devolver además
 * un `everyoneCanPost` sería la segunda copia del mismo hecho, con el riesgo
 * clásico de que un día discrepen. La invariante se nombra una vez, acá.
 *
 * No entra a la tabla de voz de ausencia del cliente: esto no es contenido que
 * falta. Todos los miembros ven el mismo estado del álbum, así que decir «abre
 * a las 20:00» no revela nada de nadie.
 */
export declare enum AlbumPostingClosedReason {
    /** El interruptor manual está en «sólo organizadores». */
    ORGANIZERS_ONLY = "ORGANIZERS_ONLY",
    /** Hay ventana y todavía no abrió. Siempre viaja con su próximo borde. */
    NOT_OPEN_YET = "NOT_OPEN_YET",
    /**
     * La ventana única ya pasó y no vuelve a abrir sola.
     *
     * Es el único motivo que viaja SIN próximo borde, y por eso existe separado
     * de [NOT_OPEN_YET]: la app tiene que poder decir «se cerró el domingo» en
     * vez de quedarse muda esperando un instante que no va a llegar.
     */
    ALREADY_CLOSED = "ALREADY_CLOSED"
}
