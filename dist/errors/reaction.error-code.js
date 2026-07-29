"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionErrorCode = void 0;
var ReactionErrorCode;
(function (ReactionErrorCode) {
    ReactionErrorCode["REACTION_TOGGLE_FAILED"] = "REACTION_TOGGLE_FAILED";
    /** El target de la reacción no pertenece al álbum del pedido (403). Usaba
     * `REACTION_TOGGLE_FAILED`, que describe un fallo interno y no un rechazo. */
    ReactionErrorCode["REACTION_TARGET_FORBIDDEN"] = "REACTION_TARGET_FORBIDDEN";
})(ReactionErrorCode || (exports.ReactionErrorCode = ReactionErrorCode = {}));
