"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumErrorCode = void 0;
/**
 * Códigos de error del módulo de álbumes
 */
var AlbumErrorCode;
(function (AlbumErrorCode) {
    AlbumErrorCode["ALBUM_NOT_FOUND"] = "ALBUM_NOT_FOUND";
    AlbumErrorCode["ALBUM_PERMISSION_DENIED"] = "ALBUM_PERMISSION_DENIED";
    AlbumErrorCode["ALBUM_OWNER_REQUIRED"] = "ALBUM_OWNER_REQUIRED";
    AlbumErrorCode["ALBUM_ORGANIZER_REQUIRED"] = "ALBUM_ORGANIZER_REQUIRED";
    AlbumErrorCode["ALBUM_INVITE_INVALID"] = "ALBUM_INVITE_INVALID";
    AlbumErrorCode["ALBUM_INVITE_EXPIRED"] = "ALBUM_INVITE_EXPIRED";
    /**
     * El `qrCode` del álbum venció. Es una puerta DISTINTA de
     * `ALBUM_INVITE_EXPIRED` —ésa es el token de invitación— y tiene otro
     * remedio: el invite se vuelve a mandar, el qrCode lo tiene que rotar el
     * organizador. Sin código propio el único emisor posible era el 404 de
     * `ALBUM_NOT_FOUND`, y ahí el cliente no puede distinguir «este código
     * expiró, pedile uno nuevo al organizador» de «este álbum no existe».
     */
    AlbumErrorCode["ALBUM_QR_CODE_EXPIRED"] = "ALBUM_QR_CODE_EXPIRED";
    AlbumErrorCode["ALBUM_OWNER_SCAN_FORBIDDEN"] = "ALBUM_OWNER_SCAN_FORBIDDEN";
    AlbumErrorCode["ALBUM_PASSWORD_REQUIRED"] = "ALBUM_PASSWORD_REQUIRED";
    AlbumErrorCode["ALBUM_PASSWORD_INVALID"] = "ALBUM_PASSWORD_INVALID";
    AlbumErrorCode["ALBUM_NOT_SCANNED"] = "ALBUM_NOT_SCANNED";
    AlbumErrorCode["PARTICIPANT_NOT_FOUND"] = "PARTICIPANT_NOT_FOUND";
})(AlbumErrorCode || (exports.AlbumErrorCode = AlbumErrorCode = {}));
