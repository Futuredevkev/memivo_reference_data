import type { PollOptionResult } from '../../polls';
/**
 * Resultados de la encuesta de una historia, emitidos al room `story_<storyId>`.
 * Agregado puro: no hay identidad de votante que filtrar, así que va en un solo
 * `emit` al room y no paga el fan-out per-viewer.
 */
export interface StoryPollResultsPayload {
    storyId: string;
    pollId: string;
    options: PollOptionResult[];
}
