"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonErrorCode = void 0;
/**
 * Códigos de error generales del sistema
 */
var CommonErrorCode;
(function (CommonErrorCode) {
    CommonErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    CommonErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    CommonErrorCode["CONFLICT"] = "CONFLICT";
    CommonErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    CommonErrorCode["FORBIDDEN"] = "FORBIDDEN";
    CommonErrorCode["NOT_FOUND"] = "NOT_FOUND";
    CommonErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    CommonErrorCode["FILES_EMPTY"] = "FILES_EMPTY";
    CommonErrorCode["FILES_TOO_LARGE"] = "FILES_TOO_LARGE";
    CommonErrorCode["FILES_TOO_MANY"] = "FILES_TOO_MANY";
    CommonErrorCode["FILES_UNSUPPORTED_FORMAT"] = "FILES_UNSUPPORTED_FORMAT";
    CommonErrorCode["TOO_MANY_REQUESTS"] = "TOO_MANY_REQUESTS";
    // Upload errors
    CommonErrorCode["UPLOAD_FAILED"] = "UPLOAD_FAILED";
    CommonErrorCode["UPLOAD_URL_MISSING"] = "UPLOAD_URL_MISSING";
    CommonErrorCode["UPLOAD_FILE_MISSING"] = "UPLOAD_FILE_MISSING";
    CommonErrorCode["UPLOAD_PUBLIC_ID_MISSING"] = "UPLOAD_PUBLIC_ID_MISSING";
})(CommonErrorCode || (exports.CommonErrorCode = CommonErrorCode = {}));
