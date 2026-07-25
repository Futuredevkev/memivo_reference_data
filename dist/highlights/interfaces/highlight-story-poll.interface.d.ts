import type { AlbumMemberRole } from '../../album';
import type { HighlightStory } from './highlight-story.interface';
/**
 * Encuesta de historia más votada. Hereda el shape de la historia (misma card en
 * el cliente) y agrega la pregunta.
 *
 * `count` = VOTANTES, uno por persona: lo garantiza el unique `(pollId, userId)`
 * de la base. Nunca el desglose por opción ni quién votó qué.
 */
export interface HighlightStoryPoll<TTimestamp = string, TRole extends string = AlbumMemberRole> extends HighlightStory<TTimestamp, TRole> {
    question: string;
}
