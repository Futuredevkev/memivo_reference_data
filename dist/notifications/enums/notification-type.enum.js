"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["LIKE_PHOTO"] = "LIKE_PHOTO";
    NotificationType["COMMENT_PHOTO"] = "COMMENT_PHOTO";
    NotificationType["REPLY_COMMENT"] = "REPLY_COMMENT";
    NotificationType["CHAT_INVITATION"] = "CHAT_INVITATION";
    NotificationType["NEW_CHAT_MESSAGE"] = "NEW_CHAT_MESSAGE";
    NotificationType["CHAT_MESSAGE_REPLY"] = "CHAT_MESSAGE_REPLY";
    NotificationType["PROFESSIONAL_PHOTOS_UPLOADED"] = "PROFESSIONAL_PHOTOS_UPLOADED";
    NotificationType["TAGGED_IN_PHOTO"] = "TAGGED_IN_PHOTO";
    NotificationType["POLL_CREATED"] = "POLL_CREATED";
    NotificationType["MEMBER_KICKED"] = "MEMBER_KICKED";
    NotificationType["CHAT_MEMBER_KICKED"] = "CHAT_MEMBER_KICKED";
    NotificationType["ALBUM_DELETED"] = "ALBUM_DELETED";
    NotificationType["ALBUM_HIDDEN"] = "ALBUM_HIDDEN";
    NotificationType["CHAT_GROUP_DELETED"] = "CHAT_GROUP_DELETED";
    NotificationType["MEMBER_PROMOTED_ADMIN"] = "MEMBER_PROMOTED_ADMIN";
    NotificationType["MEMBER_DEMOTED_ADMIN"] = "MEMBER_DEMOTED_ADMIN";
    NotificationType["ALBUM_ORGANIZER_PROMOTED"] = "ALBUM_ORGANIZER_PROMOTED";
    NotificationType["ALBUM_ORGANIZER_REMOVED"] = "ALBUM_ORGANIZER_REMOVED";
    NotificationType["ALBUM_OWNERSHIP_TRANSFERRED"] = "ALBUM_OWNERSHIP_TRANSFERRED";
    NotificationType["CHAT_GROUP_OWNERSHIP_TRANSFERRED"] = "CHAT_GROUP_OWNERSHIP_TRANSFERRED";
    NotificationType["REACTION_COMMENT"] = "REACTION_COMMENT";
    NotificationType["REACTION_RESPONSE"] = "REACTION_RESPONSE";
    NotificationType["CHAT_MESSAGE_REACTION"] = "CHAT_MESSAGE_REACTION";
    NotificationType["HIGHLIGHTS_REMINDER"] = "HIGHLIGHTS_REMINDER";
    NotificationType["MEMIVO_MOMENTS"] = "MEMIVO_MOMENTS";
    NotificationType["TAGGED_IN_STORY"] = "TAGGED_IN_STORY";
    NotificationType["STORY_COMMENT"] = "STORY_COMMENT";
    NotificationType["DAILY_MOTIVATIONAL"] = "DAILY_MOTIVATIONAL";
    NotificationType["GUEST_POST_UPLOAD_READY"] = "GUEST_POST_UPLOAD_READY";
    NotificationType["PROFESSIONAL_PHOTOS_UPLOAD_READY"] = "PROFESSIONAL_PHOTOS_UPLOAD_READY";
    NotificationType["STORY_UPLOAD_READY"] = "STORY_UPLOAD_READY";
    NotificationType["DOWNLOAD_READY"] = "DOWNLOAD_READY";
    NotificationType["GUEST_POST_UPLOAD_FAILED"] = "GUEST_POST_UPLOAD_FAILED";
    NotificationType["PROFESSIONAL_PHOTOS_UPLOAD_FAILED"] = "PROFESSIONAL_PHOTOS_UPLOAD_FAILED";
    NotificationType["STORY_UPLOAD_FAILED"] = "STORY_UPLOAD_FAILED";
    NotificationType["CHAT_MEDIA_UPLOAD_FAILED"] = "CHAT_MEDIA_UPLOAD_FAILED";
    NotificationType["ALBUM_MODERATION_ALERT"] = "ALBUM_MODERATION_ALERT";
    NotificationType["CONTENT_REMOVED_BY_ORGANIZER"] = "CONTENT_REMOVED_BY_ORGANIZER";
    NotificationType["ALBUM_QR_CODE_EXPIRING"] = "ALBUM_QR_CODE_EXPIRING";
    /**
     * Memivo retiró una pieza tuya, por su propia autoridad.
     *
     * ── POR QUÉ NO REUSA `CONTENT_REMOVED_BY_ORGANIZER` ─────────────────────
     * Porque ese aviso dice, textual y en los tres idiomas, «Un organizador
     * removió …», y el comentario que justifica esa palabra se apoya en que el
     * tipo dispara SÓLO para moderación de owner/organizer. Un retiro de
     * plataforma por reclamo de un tercero rompe esa premisa: el autor recibiría
     * un aviso que le miente sobre quién actuó y que además le echa la culpa a
     * un organizador que no hizo nada. Compila igual, el test pasa igual, y la
     * persona se entera mal — que es el peor modo de falla posible para un
     * aviso.
     *
     * Comparte la metadata con su hermano (`ContentRemovalMetadata`): el dato es
     * el mismo y lo que cambia es la voz del texto.
     */
    NotificationType["CONTENT_REMOVED_BY_MEMIVO"] = "CONTENT_REMOVED_BY_MEMIVO";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
