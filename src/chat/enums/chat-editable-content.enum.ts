/**
 * QUÉ parte de un mensaje puede reescribir su AUTOR después de haberlo mandado.
 *
 * ── EL DEFECTO QUE CIERRA, MEDIDO ──────────────────────────────────────────
 * «¿Esto se puede editar?» se contestaba en DOS lugares con dos criterios
 * distintos: el servidor sólo aceptaba `TEXT`, y la app ofrecía el botón
 * también para todo mensaje con texto no vacío — o sea para toda MEDIA CON
 * PIE. El conjunto de la segunda mitad no tenía ni un caso en que el servidor
 * dijera que sí: la hoja ofrecía «Editar mensaje», la persona escribía el pie
 * nuevo, tocaba guardar, y el único final posible era un 400
 * `CHAT_MESSAGE_EDIT_UNSUPPORTED` con su toast rojo.
 *
 * ── POR QUÉ UN ENUM Y NO UN BOOLEANO ───────────────────────────────────────
 * Porque la pregunta que un tipo nuevo tiene que contestar no es «sí o no»,
 * es QUÉ. El endpoint de edición reescribe el campo `content` y nada más, así
 * que hoy sólo hay dos respuestas posibles; el día que un tipo tenga una
 * segunda parte reescribible —los destinos de una encuesta, el pie de una
 * foto como algo distinto de su texto— un booleano ya no podría decir cuál de
 * las dos, y la respuesta se escaparía a la superficie que la use. El enum
 * deja ese crecimiento adentro del contrato.
 *
 * Es el mismo eje que `ChatContentPayload` mira desde el otro lado: aquél dice
 * qué trae adentro un mensaje, éste dice qué de eso su autor puede rehacer.
 */
export enum ChatEditableContent {
  /** Nada. El mensaje es inmutable desde que se manda. */
  NONE = 'NONE',
  /** El texto propio del mensaje, o sea la columna `content`. */
  TEXT = 'TEXT',
}
