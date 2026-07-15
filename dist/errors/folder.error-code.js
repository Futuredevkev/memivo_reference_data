"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderErrorCode = void 0;
var FolderErrorCode;
(function (FolderErrorCode) {
    FolderErrorCode["FOLDER_NOT_FOUND"] = "FOLDER_NOT_FOUND";
    FolderErrorCode["FOLDER_ORGANIZER_REQUIRED"] = "FOLDER_ORGANIZER_REQUIRED";
    FolderErrorCode["FOLDER_NAME_CONFLICT"] = "FOLDER_NAME_CONFLICT";
    FolderErrorCode["FOLDER_MAX_COUNT_EXCEEDED"] = "FOLDER_MAX_COUNT_EXCEEDED";
    FolderErrorCode["FOLDER_ALBUM_MISMATCH"] = "FOLDER_ALBUM_MISMATCH";
    // set-cover: la foto no es PROFESSIONAL ∈ esta carpeta (§6.3.1, fix H4)
    FolderErrorCode["FOLDER_COVER_PHOTO_INVALID"] = "FOLDER_COVER_PHOTO_INVALID";
})(FolderErrorCode || (exports.FolderErrorCode = FolderErrorCode = {}));
