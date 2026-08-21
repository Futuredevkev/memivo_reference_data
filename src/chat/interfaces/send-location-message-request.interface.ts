import type { ChatLiveLocationDuration } from '../enums';

/**
 * Mandar una ubicación a un grupo de chat. Las DOS variantes entran por acá, y
 * `liveDuration` es lo único que las separa.
 *
 * ── POR QUÉ UN SOLO PEDIDO Y NO DOS ENDPOINTS ──────────────────────────────
 * Porque lo que se crea es el mismo mensaje —un `LOCATION` en el mismo grupo,
 * con la misma autorización, la misma cita y la misma deduplicación— y lo único
 * distinto es si además queda un canal abierto. Dos altas separadas serían dos
 * copias de la validación de acceso, la cita y el `clientTempId`, y la segunda
 * se atrasaría (ORDEN §1).
 *
 * ── EL PLAZO ES UN MIEMBRO DEL ENUM, NUNCA UNA CANTIDAD DE MINUTOS ─────────
 * Ver `ChatLiveLocationDuration`: un número acá sería el freno de esta función
 * en manos de quien la usa.
 *
 * ── LAS COORDENADAS VAN AUNQUE EL COMPARTIR SEA EN VIVO ───────────────────
 * Son la PRIMERA posición del canal, no un punto que se guarde: en vivo, la
 * fila del mensaje nace sin punto y esta lectura entra directo a Redis, que es
 * donde vive la posición. Sin ellas, quien recibe el mensaje vería un compartir
 * abierto y vacío hasta el primer envío periódico.
 */
export interface SendLocationMessageRequest {
  albumId: string;
  latitude: number;
  longitude: number;
  /** Ausente = punto FIJO. Presente = compartir EN VIVO por ese plazo. */
  liveDuration?: ChatLiveLocationDuration;
  clientTempId?: string;
  replyToMessageId?: string;
}
