/**
 * El mensaje desde el que se lee una fecha: el primero visible para quien mira
 * desde ese instante en adelante, o —si después no hay ninguno— el último
 * anterior. `null` sólo cuando el chat no tiene ningún mensaje visible.
 */
export interface ChatMessageAnchorResponse {
  messageId: string | null;
}
