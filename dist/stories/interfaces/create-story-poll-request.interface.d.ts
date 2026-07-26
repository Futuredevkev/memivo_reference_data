import type { StoryOverlayPosition } from './story-overlay-position.interface';
/**
 * Encuesta creada junto con la historia, en su misma transacción.
 *
 * Sin `durationMinutes`: el reloj es HEREDADO de la historia
 * (`poll.expiresAt = story.expiresAt`), así que "archivada ⇒ invotable" queda
 * enforceado por el validador de encuestas que ya existe, sin código nuevo.
 *
 * La POSICIÓN viaja acá y no aparte: la encuesta se coloca sobre la foto al
 * crearla, igual que un tag, y nace con la historia en la misma transacción.
 * Mismas coordenadas normalizadas (0–1 sobre el MEDIA, no sobre la pantalla)
 * que `StoryTagPosition`, para que el mismo par de proyecciones sirva a los
 * dos y no haya dos sistemas de coordenadas conviviendo.
 */
export interface CreateStoryPollRequest extends StoryOverlayPosition {
    question: string;
    options: string[];
}
