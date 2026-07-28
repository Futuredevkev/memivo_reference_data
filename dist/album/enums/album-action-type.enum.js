"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumActionType = void 0;
var AlbumActionType;
(function (AlbumActionType) {
    AlbumActionType["MEMBER_KICKED"] = "MEMBER_KICKED";
    AlbumActionType["ORGANIZER_PROMOTED"] = "ORGANIZER_PROMOTED";
    AlbumActionType["ORGANIZER_DEMOTED"] = "ORGANIZER_DEMOTED";
    AlbumActionType["GUEST_POST_DELETED"] = "GUEST_POST_DELETED";
    AlbumActionType["GUEST_PHOTOS_DELETED"] = "GUEST_PHOTOS_DELETED";
    AlbumActionType["PHOTO_DELETED"] = "PHOTO_DELETED";
    AlbumActionType["ALL_PHOTOS_DELETED"] = "ALL_PHOTOS_DELETED";
    AlbumActionType["FOLDER_DELETED"] = "FOLDER_DELETED";
    AlbumActionType["STORY_DELETED"] = "STORY_DELETED";
    AlbumActionType["COMMENT_DELETED"] = "COMMENT_DELETED";
    AlbumActionType["RESPONSE_DELETED"] = "RESPONSE_DELETED";
    AlbumActionType["STORY_COMMENT_DELETED"] = "STORY_COMMENT_DELETED";
    AlbumActionType["ALBUM_UPDATED"] = "ALBUM_UPDATED";
    AlbumActionType["ALBUM_VISIBILITY_CHANGED"] = "ALBUM_VISIBILITY_CHANGED";
    /**
     * El dueño rotó el acceso: QR nuevo + invite-links revocados. Deja rastro
     * porque invalida TODOS los links repartidos hasta ese momento — es la acción
     * de álbum con más alcance sobre gente de afuera, y sin registro nadie puede
     * explicar después por qué un link dejó de funcionar.
     */
    AlbumActionType["ALBUM_ACCESS_RESET"] = "ALBUM_ACCESS_RESET";
    AlbumActionType["ALBUM_COVER_CHANGED"] = "ALBUM_COVER_CHANGED";
    AlbumActionType["FOLDER_CREATED"] = "FOLDER_CREATED";
    AlbumActionType["FOLDER_RENAMED"] = "FOLDER_RENAMED";
    AlbumActionType["FOLDER_COVER_SET"] = "FOLDER_COVER_SET";
})(AlbumActionType || (exports.AlbumActionType = AlbumActionType = {}));
