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
    PhotoErrorCode["GUEST_POST_NOT_FOUND"] = "GUEST_POST_NOT_FOUND";
    PhotoErrorCode["GUEST_POST_EMPTY"] = "GUEST_POST_EMPTY";
    /** Editar una publicación ajena. Usaba `PHOTO_DELETE_FORBIDDEN`, cuya copia
     * habla de BORRAR fotos: el único caller es el PATCH de edición. */
    PhotoErrorCode["GUEST_POST_EDIT_FORBIDDEN"] = "GUEST_POST_EDIT_FORBIDDEN";
    PhotoErrorCode["GUEST_VIDEO_TOO_LONG"] = "GUEST_VIDEO_TOO_LONG";
    // Photo Tags
    PhotoErrorCode["PHOTO_TAG_ALREADY_EXISTS"] = "PHOTO_TAG_ALREADY_EXISTS";
    PhotoErrorCode["PHOTO_TAG_FORBIDDEN"] = "PHOTO_TAG_FORBIDDEN";
    PhotoErrorCode["PHOTO_TAG_NOT_GUEST_PHOTO"] = "PHOTO_TAG_NOT_GUEST_PHOTO";
    PhotoErrorCode["PHOTO_TAG_NOT_FOUND"] = "PHOTO_TAG_NOT_FOUND";
    /**
     * La publicación llegó al tope de personas etiquetadas.
     *
     * El tope existía y sólo lo aplicaba UNA de las dos puertas: el `finalize`
     * de la subida lo capaba con `@ArrayMaxSize`, y `POST /photos/:id/tags`
     * —que etiqueta una foto YA PUBLICADA— no contaba nada. La app decía
     * «Podés etiquetar hasta 50» al crear el post y, sobre el MISMO post ya
     * publicado, dejaba etiquetar sin freno hasta agotar la lista de miembros,
     * cada etiqueta con su notificación y su push. La regla que la app anuncia
     * tiene que ser la regla que el sistema aplica.
     */
    PhotoErrorCode["PHOTO_TAG_LIMIT_REACHED"] = "PHOTO_TAG_LIMIT_REACHED";
    // Uploads
    PhotoErrorCode["UPLOAD_ALL_FAILED"] = "UPLOAD_ALL_FAILED";
    PhotoErrorCode["UPLOAD_ALBUM_MISMATCH"] = "UPLOAD_ALBUM_MISMATCH";
    // Media Types
    PhotoErrorCode["IMAGE_NOT_FOUND"] = "IMAGE_NOT_FOUND";
})(PhotoErrorCode || (exports.PhotoErrorCode = PhotoErrorCode = {}));
