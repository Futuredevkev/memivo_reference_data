"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportErrorCode = void 0;
/**
 * Codigos de error del modulo de reportes.
 */
var ReportErrorCode;
(function (ReportErrorCode) {
    ReportErrorCode["PROFILE_REPORT_NOT_FOUND"] = "PROFILE_REPORT_NOT_FOUND";
    ReportErrorCode["PROFILE_REPORT_SELF"] = "PROFILE_REPORT_SELF";
    ReportErrorCode["PROFILE_REPORT_ALREADY_CLOSED"] = "PROFILE_REPORT_ALREADY_CLOSED";
    ReportErrorCode["PROFILE_REPORT_DUPLICATE"] = "PROFILE_REPORT_DUPLICATE";
    ReportErrorCode["PROFILE_REPORT_CREATE_FAILED"] = "PROFILE_REPORT_CREATE_FAILED";
    ReportErrorCode["PROFILE_REPORT_STATUS_UPDATE_FAILED"] = "PROFILE_REPORT_STATUS_UPDATE_FAILED";
    ReportErrorCode["PROFILE_REPORT_BAN_REPORTED_USER_FAILED"] = "PROFILE_REPORT_BAN_REPORTED_USER_FAILED";
    ReportErrorCode["MODERATION_BAN_SELF_FORBIDDEN"] = "MODERATION_BAN_SELF_FORBIDDEN";
})(ReportErrorCode || (exports.ReportErrorCode = ReportErrorCode = {}));
