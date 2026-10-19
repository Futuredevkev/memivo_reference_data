/**
 * Códigos de error del módulo de encuestas (polls)
 */
export declare enum PollErrorCode {
    POLL_MIN_OPTIONS = "POLL_MIN_OPTIONS",
    POLL_MAX_OPTIONS = "POLL_MAX_OPTIONS",
    POLL_OPTION_EMPTY = "POLL_OPTION_EMPTY",
    POLL_OPTIONS_UNIQUE = "POLL_OPTIONS_UNIQUE",
    POLL_OPTION_INVALID = "POLL_OPTION_INVALID",
    POLL_MIN_DURATION = "POLL_MIN_DURATION",
    POLL_MAX_DURATION = "POLL_MAX_DURATION",
    POLL_NOT_FOUND = "POLL_NOT_FOUND",
    POLL_NOT_ACTIVE = "POLL_NOT_ACTIVE",
    POLL_EXPIRED = "POLL_EXPIRED",
    POLL_CREATE_FAILED = "POLL_CREATE_FAILED",
    /**
     * Un solo código para votar en la encuesta de un chat o en la de una
     * historia: el hecho (tu voto no quedó) y el remedio (volver a votar) son
     * los mismos, y lo que cambia es qué tabla guarda el voto.
     */
    POLL_VOTE_FAILED = "POLL_VOTE_FAILED"
}
