import type { PollOptionResult } from '../../polls';
/**
 * La encuesta dejó de aceptar votos porque su historia expiró.
 *
 * Lleva el agregado FINAL a propósito: sin él, cada cliente conectado tendría
 * que refetchear para pintar el resultado de cierre.
 */
export interface StoryPollClosedPayload {
    storyId: string;
    pollId: string;
    options: PollOptionResult[];
}
