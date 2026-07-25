/**
 * Encuesta creada junto con la historia, en su misma transacción.
 *
 * Sin `durationMinutes`: el reloj es HEREDADO de la historia
 * (`poll.expiresAt = story.expiresAt`), así que "archivada ⇒ invotable" queda
 * enforceado por el validador de encuestas que ya existe, sin código nuevo.
 */
export interface CreateStoryPollRequest {
  question: string;
  options: string[];
}
