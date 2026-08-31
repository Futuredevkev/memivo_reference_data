"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationErrorCode = void 0;
var ModerationErrorCode;
(function (ModerationErrorCode) {
    ModerationErrorCode["MODERATION_CASE_NOT_FOUND"] = "MODERATION_CASE_NOT_FOUND";
    ModerationErrorCode["MODERATION_BAN_NOT_FOUND"] = "MODERATION_BAN_NOT_FOUND";
    /** La pieza que el expediente manda remover no existe (o ya se removió). */
    ModerationErrorCode["MODERATED_CONTENT_NOT_FOUND"] = "MODERATED_CONTENT_NOT_FOUND";
})(ModerationErrorCode || (exports.ModerationErrorCode = ModerationErrorCode = {}));
