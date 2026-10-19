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
    // ── LA OPERACIÓN QUE PIDIÓ LA PERSONA FALLÓ POR ALGO INESPERADO ──────────
    // Status 500 y sufijo `_FAILED`. Cada código nombra la operación del BORDE
    // —lo que la persona pidió—, no un paso de adentro. Antes caían en
    // `INTERNAL_SERVER_ERROR` y la app decía «Error interno del servidor» en vez
    // de qué fue lo que no se pudo hacer.
    FolderErrorCode["FOLDER_CREATE_FAILED"] = "FOLDER_CREATE_FAILED";
    FolderErrorCode["FOLDER_UPDATE_FAILED"] = "FOLDER_UPDATE_FAILED";
    FolderErrorCode["FOLDER_COVER_UPDATE_FAILED"] = "FOLDER_COVER_UPDATE_FAILED";
})(FolderErrorCode || (exports.FolderErrorCode = FolderErrorCode = {}));
