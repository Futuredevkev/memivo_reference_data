export enum ReactionErrorCode {
  REACTION_TOGGLE_FAILED = 'REACTION_TOGGLE_FAILED',
  /** El target de la reacción no pertenece al álbum del pedido (403). Usaba
   * `REACTION_TOGGLE_FAILED`, que describe un fallo interno y no un rechazo. */
  REACTION_TARGET_FORBIDDEN = 'REACTION_TARGET_FORBIDDEN',
}
