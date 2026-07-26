import type { StoryOverlayPosition } from '../../stories/interfaces/story-overlay-position.interface';
import type { PollAggregateResponse } from './poll-aggregate-response.interface';
/**
 * Respuesta REST de una encuesta, PER-VIEWER.
 *
 * Extiende el agregado anónimo con lo único que depende de quién pregunta
 * (`myOptionId`) y con el dueño. Exactamente uno de `chatGroupId`/`storyId`
 * está presente: lo garantiza un CHECK en la base, no una convención.
 */
export interface PollResponse<TTimestamp = string> extends PollAggregateResponse<TTimestamp> {
    chatGroupId?: string | null;
    storyId?: string | null;
    /**
     * Dónde se apoya sobre el media. Sólo la traen las encuestas de HISTORIA:
     * la del chat es un mensaje en una lista y no se posiciona sobre nada.
     * `null` en las creadas antes de que la encuesta se pudiera colocar.
     */
    position?: StoryOverlayPosition | null;
    /** La opción que votó QUIEN PIDE. Nunca la de otro. `null` = no votó. */
    myOptionId: string | null;
}
