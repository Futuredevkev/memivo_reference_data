import type { PollAggregateResponse } from '../../polls';

/**
 * Payload de una encuesta de chat emitido AL ROOM.
 *
 * Es el agregado anónimo, no `PollResponse`: un broadcast va a todo el grupo y
 * por lo tanto no puede llevar `myOptionId` ni ninguna otra identidad de
 * votante. El voto propio llega por REST y vive en estado local del cliente.
 */
export type ChatPollSocketPayload<TTimestamp = string> =
  PollAggregateResponse<TTimestamp>;
