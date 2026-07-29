"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadErrorCode = void 0;
var UploadErrorCode;
(function (UploadErrorCode) {
    UploadErrorCode["UPLOAD_INTENT_NOT_FOUND"] = "UPLOAD_INTENT_NOT_FOUND";
    UploadErrorCode["UPLOAD_INTENT_EXPIRED"] = "UPLOAD_INTENT_EXPIRED";
    UploadErrorCode["UPLOAD_INTENT_FORBIDDEN"] = "UPLOAD_INTENT_FORBIDDEN";
    UploadErrorCode["UPLOAD_INTENT_FILE_NOT_FOUND"] = "UPLOAD_INTENT_FILE_NOT_FOUND";
    UploadErrorCode["UPLOAD_INTENT_INVALID_CONTEXT"] = "UPLOAD_INTENT_INVALID_CONTEXT";
    UploadErrorCode["UPLOAD_FILTER_NOT_ALLOWED_FOR_CONTEXT"] = "UPLOAD_FILTER_NOT_ALLOWED_FOR_CONTEXT";
    UploadErrorCode["UPLOAD_INTENT_FINALIZE_FAILED"] = "UPLOAD_INTENT_FINALIZE_FAILED";
    UploadErrorCode["UPLOAD_SIGNATURE_FAILED"] = "UPLOAD_SIGNATURE_FAILED";
    UploadErrorCode["UPLOAD_CLOUDINARY_RESPONSE_INVALID"] = "UPLOAD_CLOUDINARY_RESPONSE_INVALID";
})(UploadErrorCode || (exports.UploadErrorCode = UploadErrorCode = {}));
