"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollErrorCode = void 0;
/**
 * Códigos de error del módulo de encuestas (polls)
 */
var PollErrorCode;
(function (PollErrorCode) {
    // Options
    PollErrorCode["POLL_MIN_OPTIONS"] = "POLL_MIN_OPTIONS";
    PollErrorCode["POLL_MAX_OPTIONS"] = "POLL_MAX_OPTIONS";
    PollErrorCode["POLL_OPTION_EMPTY"] = "POLL_OPTION_EMPTY";
    PollErrorCode["POLL_OPTIONS_UNIQUE"] = "POLL_OPTIONS_UNIQUE";
    PollErrorCode["POLL_OPTION_INVALID"] = "POLL_OPTION_INVALID";
    // Duration
    PollErrorCode["POLL_MIN_DURATION"] = "POLL_MIN_DURATION";
    PollErrorCode["POLL_MAX_DURATION"] = "POLL_MAX_DURATION";
    // Poll Status
    PollErrorCode["POLL_NOT_FOUND"] = "POLL_NOT_FOUND";
    PollErrorCode["POLL_NOT_ACTIVE"] = "POLL_NOT_ACTIVE";
    PollErrorCode["POLL_EXPIRED"] = "POLL_EXPIRED";
    // `POLL_ALREADY_VOTED` se ELIMINÓ: votar de nuevo no es un error. Re-tocar la
    // misma opción es idempotente y tocar otra cambia el voto, así que el código
    // no tenía quién lo emitiera — sólo una traducción en tres idiomas para un
    // mensaje que nadie iba a ver.
    // ── LA OPERACIÓN QUE PIDIÓ LA PERSONA FALLÓ POR ALGO INESPERADO ──────────
    // Status 500 y sufijo `_FAILED`. Cada código nombra la operación del BORDE
    // —lo que la persona pidió—, no un paso de adentro. Antes caían en
    // `INTERNAL_SERVER_ERROR` y la app decía «Error interno del servidor» en vez
    // de qué fue lo que no se pudo hacer.
    PollErrorCode["POLL_CREATE_FAILED"] = "POLL_CREATE_FAILED";
    /**
     * Un solo código para votar en la encuesta de un chat o en la de una
     * historia: el hecho (tu voto no quedó) y el remedio (volver a votar) son
     * los mismos, y lo que cambia es qué tabla guarda el voto.
     */
    PollErrorCode["POLL_VOTE_FAILED"] = "POLL_VOTE_FAILED";
})(PollErrorCode || (exports.PollErrorCode = PollErrorCode = {}));
