import { ChatContentBinding } from '../enums';
import type { RelocatableChatMessage } from '../interfaces';

/**
 * Cuándo se DA cada estado que ata un mensaje a su chat.
 *
 * `Record` TOTAL, y ése es todo el punto: agregar un miembro a
 * `ChatContentBinding` sin escribir acá su predicado no compila. Sin esta
 * tabla, «en vivo» o «se ve una sola vez» serían condiciones sueltas dentro de
 * la puerta, y una condición suelta se olvida — que es exactamente cómo una
 * política que mira sólo el `type` termina reenviando un view-once.
 *
 * Los predicados leen `RelocatableChatMessage`, así que la cadena se cierra
 * sola: estado nuevo → predicado obligatorio → el campo que el predicado lee
 * tiene que existir en la forma mínima que los dos repos saben construir.
 */
export const CHAT_CONTENT_BINDING_HOLDS: Record<
  ChatContentBinding,
  (message: RelocatableChatMessage) => boolean
> = {
  [ChatContentBinding.VIEW_ONCE]: (message) => message.viewOnce === true,
};
