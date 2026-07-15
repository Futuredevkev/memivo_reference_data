"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoErrorCode = void 0;
/**
 * Códigos de error del módulo de fotos y uploads
 */
var PhotoErrorCode;
(function (PhotoErrorCode) {
    // Photos
    PhotoErrorCode["PHOTO_NOT_FOUND"] = "PHOTO_NOT_FOUND";
    PhotoErrorCode["PHOTO_DELETE_FORBIDDEN"] = "PHOTO_DELETE_FORBIDDEN";
    PhotoErrorCode["GUEST_POST_NOT_FOUND"] = "GUEST_POST_NOT_FOUND";
    PhotoErrorCode["GUEST_POST_EMPTY"] = "GUEST_POST_EMPTY";
    PhotoErrorCode["GUEST_VIDEO_TOO_LONG"] = "GUEST_VIDEO_TOO_LONG";
    // Photo Tags
    PhotoErrorCode["PHOTO_TAG_ALREADY_EXISTS"] = "PHOTO_TAG_ALREADY_EXISTS";
    PhotoErrorCode["PHOTO_TAG_FORBIDDEN"] = "PHOTO_TAG_FORBIDDEN";
    PhotoErrorCode["PHOTO_TAG_NOT_GUEST_PHOTO"] = "PHOTO_TAG_NOT_GUEST_PHOTO";
    PhotoErrorCode["PHOTO_TAG_NOT_FOUND"] = "PHOTO_TAG_NOT_FOUND";
    // Uploads
    PhotoErrorCode["UPLOAD_ALL_FAILED"] = "UPLOAD_ALL_FAILED";
    PhotoErrorCode["UPLOAD_ALBUM_MISMATCH"] = "UPLOAD_ALBUM_MISMATCH";
    // Media Types
    PhotoErrorCode["VIDEO_NOT_FOUND"] = "VIDEO_NOT_FOUND";
    PhotoErrorCode["IMAGE_NOT_FOUND"] = "IMAGE_NOT_FOUND";
    PhotoErrorCode["AUDIO_NOT_FOUND"] = "AUDIO_NOT_FOUND";
})(PhotoErrorCode || (exports.PhotoErrorCode = PhotoErrorCode = {}));
