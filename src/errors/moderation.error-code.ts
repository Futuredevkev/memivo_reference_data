export enum ModerationErrorCode {
  MODERATION_CASE_NOT_FOUND = 'MODERATION_CASE_NOT_FOUND',
  MODERATION_BAN_NOT_FOUND = 'MODERATION_BAN_NOT_FOUND',
  /** La pieza que el expediente manda remover no existe (o ya se removió). */
  MODERATED_CONTENT_NOT_FOUND = 'MODERATED_CONTENT_NOT_FOUND',
  /**
   * Se pidió resolver un expediente que ya estaba resuelto.
   *
   * Antes esto contestaba `200` con el estado sin cambios, que es
   * indistinguible de haber funcionado. Una resolución es un HECHO fechado: el
   * segundo pedido no puede correr la fecha de algo que ya pasó, y tiene que
   * poder enterarse de que no escribió.
   */
  MODERATION_CASE_ALREADY_RESOLVED = 'MODERATION_CASE_ALREADY_RESOLVED',
  /**
   * Se pidió abrir un hold legal que ya estaba abierto, o liberar uno que no
   * lo estaba.
   *
   * El hold es un registro append-only y su estado se deriva del último
   * evento, así que la transición inválida se puede nombrar. El defecto que
   * cierra es el mismo del código de arriba: contestar `200` sobre una
   * escritura que no pasó le hace creer a quien modera que reabrió un hold — y
   * de eso depende que el material no se destruya.
   */
  MODERATION_LEGAL_HOLD_TRANSITION_INVALID = 'MODERATION_LEGAL_HOLD_TRANSITION_INVALID',
}
