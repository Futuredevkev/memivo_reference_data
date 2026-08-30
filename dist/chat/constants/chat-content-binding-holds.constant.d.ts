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
 *
 * ── NINGÚN PREDICADO MIRA EL RELOJ, Y ES UNA REGLA DE LA TABLA ─────────────
 * Los dos leen una propiedad ESTABLE de la fila: una bandera y la presencia de
 * un campo. Un predicado que comparara contra `Date.now()` haría que el mismo
 * mensaje se clasificara distinto según cuándo se pregunte, y las dos puntas
 * que consultan esta puerta —el servidor con su reloj, la app con el suyo—
 * podrían contestar cosas opuestas sobre la misma fila. El vencimiento de un
 * compartir en vivo lo hace cumplir el servidor en el camino de la EMISIÓN,
 * que es donde tiene sentido; acá sólo se decide si el contenido se muda.
 */
export declare const CHAT_CONTENT_BINDING_HOLDS: Record<ChatContentBinding, (message: RelocatableChatMessage) => boolean>;
