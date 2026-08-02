"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumErrorCode = void 0;
/**
 * Códigos de error del módulo de álbumes
 */
var AlbumErrorCode;
(function (AlbumErrorCode) {
    AlbumErrorCode["ALBUM_NOT_FOUND"] = "ALBUM_NOT_FOUND";
    AlbumErrorCode["ALBUM_PRIVATE"] = "ALBUM_PRIVATE";
    AlbumErrorCode["ALBUM_PERMISSION_DENIED"] = "ALBUM_PERMISSION_DENIED";
    AlbumErrorCode["ALBUM_OWNER_REQUIRED"] = "ALBUM_OWNER_REQUIRED";
    AlbumErrorCode["ALBUM_ORGANIZER_REQUIRED"] = "ALBUM_ORGANIZER_REQUIRED";
    AlbumErrorCode["ALBUM_INVITE_INVALID"] = "ALBUM_INVITE_INVALID";
    AlbumErrorCode["ALBUM_INVITE_EXPIRED"] = "ALBUM_INVITE_EXPIRED";
    AlbumErrorCode["ALBUM_OWNER_SCAN_FORBIDDEN"] = "ALBUM_OWNER_SCAN_FORBIDDEN";
    AlbumErrorCode["ALBUM_ALREADY_SCANNED"] = "ALBUM_ALREADY_SCANNED";
    AlbumErrorCode["ALBUM_PASSWORD_REQUIRED"] = "ALBUM_PASSWORD_REQUIRED";
    AlbumErrorCode["ALBUM_PASSWORD_INVALID"] = "ALBUM_PASSWORD_INVALID";
    AlbumErrorCode["ALBUM_NOT_SCANNED"] = "ALBUM_NOT_SCANNED";
    AlbumErrorCode["PARTICIPANT_NOT_FOUND"] = "PARTICIPANT_NOT_FOUND";
})(AlbumErrorCode || (exports.AlbumErrorCode = AlbumErrorCode = {}));
