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
    PollErrorCode["POLL_ALREADY_VOTED"] = "POLL_ALREADY_VOTED";
})(PollErrorCode || (exports.PollErrorCode = PollErrorCode = {}));
