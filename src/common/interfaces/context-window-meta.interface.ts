/**
 * La meta de una VENTANA DE CONTEXTO: el tramo que el servidor leyó alrededor
 * de un elemento puntual para poder saltar a él —un comentario, una respuesta,
 * un mensaje— desde un aviso, un deep-link o una cita.
 *
 * ── UNA FORMA, UN NOMBRE ──────────────────────────────────────────────────
 * Vivía dos veces, idéntica, con dos nombres (`CommentContextMeta` en `social`
 * y `ChatMessageContextMeta` en `chat`), y el servidor la llenaba con la
 * intersección de los dos para que `tsc` avisara si divergían. La ventana de
 * respuestas iba a ser el tercer nombre para lo mismo. El cable no cambió: son
 * los mismos cuatro campos.
 *
 * Lo que sigue siendo POR DOMINIO es el campo del objetivo en cada respuesta
 * (`targetCommentId`, `targetMessageId`, `targetResponseId`): renombrarlo a un
 * genérico rompería a los binarios instalados, que lo leen por nombre.
 */
export interface ContextWindowMeta {
  /** El ancho que el servidor aplicó, ya acotado entre su piso y su techo. */
  limit: number;
  /**
   * Hay elementos MÁS VIEJOS que la ventana. Se piden por la lista normal desde
   * `olderCursor`, que tiene la misma forma que el cursor de esa lista: la
   * ventana se siembra como su primera página.
   */
  hasOlder: boolean;
  olderCursor: string | null;
  /**
   * Hay elementos MÁS NUEVOS que la ventana. El consumidor lo usa para ofrecer
   * la vuelta a lo último: sin eso, saltar a un elemento deja al usuario en una
   * ventana de la que no vuelve a lo más nuevo —en la dirección que tenga cada
   * lista— salvo saliendo de la pantalla.
   *
   * `newerCursor` NO existe: no hay endpoint que pagine hacia adelante, así que
   * el servidor pagaba una query de fronteras y un cursor para un campo que
   * nadie podía consumir. La vuelta es un refetch de la lista, no una página más.
   */
  hasNewer: boolean;
}
