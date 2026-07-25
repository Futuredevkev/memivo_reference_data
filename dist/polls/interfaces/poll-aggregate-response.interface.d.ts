import type { PollStatus } from '../enums';
import type { PollOptionResult } from './poll-option-result.interface';
/**
 * Resultados de una encuesta SIN NINGUNA identidad de usuario.
 *
 * Es el ÚNICO tipo que puede viajar por un socket a un room: si un payload de
 * broadcast necesitara saber quién votó qué, no compilaría. Esa imposibilidad
 * es la que cierra la fuga de privacidad del chat (un voto reemitido al room
 * revelaba `userId` + `optionId`), y la que impide reintroducirla.
 */
export interface PollAggregateResponse<TTimestamp = string> {
    id: string;
    question: string;
    status: PollStatus;
    expiresAt: TTimestamp | null;
    durationMinutes: number | null;
    created_at: TTimestamp;
    options: PollOptionResult[];
}
