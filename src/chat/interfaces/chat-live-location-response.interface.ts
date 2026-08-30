import type { ChatLocationPoint } from './chat-location-point.interface';

/**
 * La posición ACTUAL de un compartir en vivo abierto.
 *
 * ── POR QUÉ EXISTE, SI YA HAY UN EVENTO DE SOCKET ─────────────────────────
 * Porque el evento sólo alcanza a quien estaba mirando. Quien entra a un chat
 * en el medio de un compartir no recibió ninguna emisión y se quedaría con una
 * burbuja que dice «en vivo» y ningún punto hasta el próximo envío, que puede
 * tardar un minuto. Esto es el estado inicial; el socket es el delta.
 *
 * `at` es CUÁNDO se midió la posición, y se manda porque su ausencia se lee
 * mal: una posición de hace diez minutos dibujada igual que una de hace dos
 * segundos le miente a quien la mira sobre dónde está la otra persona. El
 * teléfono puede haber perdido señal o haberse ido a segundo plano.
 */
export interface ChatLiveLocationResponse<TTimestamp = string> {
  messageId: string;
  senderId: string;
  point: ChatLocationPoint;
  /** Cuándo se midió esta posición. */
  at: TTimestamp;
  /** Cuándo deja de transmitir. Lo fija el servidor al abrir el compartir. */
  expiresAt: TTimestamp;
}
