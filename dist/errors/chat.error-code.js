"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatErrorCode = void 0;
/**
 * Códigos de error del módulo de chat
 */
var ChatErrorCode;
(function (ChatErrorCode) {
    // Messages
    ChatErrorCode["CHAT_FILE_NOT_FOUND"] = "CHAT_FILE_NOT_FOUND";
    ChatErrorCode["CHAT_MESSAGE_NOT_FOUND"] = "CHAT_MESSAGE_NOT_FOUND";
    ChatErrorCode["CHAT_MESSAGE_FORBIDDEN"] = "CHAT_MESSAGE_FORBIDDEN";
    ChatErrorCode["CHAT_MESSAGE_EDIT_UNSUPPORTED"] = "CHAT_MESSAGE_EDIT_UNSUPPORTED";
    ChatErrorCode["CHAT_MEDIA_MISMATCH"] = "CHAT_MEDIA_MISMATCH";
    ChatErrorCode["CHAT_MESSAGE_EMPTY"] = "CHAT_MESSAGE_EMPTY";
    ChatErrorCode["CHAT_MESSAGE_SEND_FAILED"] = "CHAT_MESSAGE_SEND_FAILED";
    /**
     * El mensaje no puede mudarse a otro chat: o lo construyó la app —un
     * aviso de sistema, una encuesta— o está atado a su chat por un estado
     * suyo, como el view-once. Quién cae de cada lado lo decide
     * `CHAT_CONTENT_RELOCATION_BY_TYPE`, y la app pregunta ANTES de ofrecer
     * el botón: llegar acá significa una request armada a mano.
     */
    ChatErrorCode["CHAT_MESSAGE_NOT_RELOCATABLE"] = "CHAT_MESSAGE_NOT_RELOCATABLE";
    ChatErrorCode["CHAT_VIDEO_TOO_LONG"] = "CHAT_VIDEO_TOO_LONG";
    ChatErrorCode["CHAT_AUDIO_TOO_LONG"] = "CHAT_AUDIO_TOO_LONG";
    ChatErrorCode["CHAT_MESSAGE_EDIT_FAILED"] = "CHAT_MESSAGE_EDIT_FAILED";
    ChatErrorCode["CHAT_MESSAGE_DELETE_FAILED"] = "CHAT_MESSAGE_DELETE_FAILED";
    ChatErrorCode["CHAT_MESSAGE_DELETE_MEDIA_FAILED"] = "CHAT_MESSAGE_DELETE_MEDIA_FAILED";
    ChatErrorCode["CHAT_MARK_AS_READ_FAILED"] = "CHAT_MARK_AS_READ_FAILED";
    // View-Once
    ChatErrorCode["CHAT_VIEW_ONCE_EXPIRED"] = "CHAT_VIEW_ONCE_EXPIRED";
    ChatErrorCode["CHAT_VIEW_ONCE_ALREADY_VIEWED"] = "CHAT_VIEW_ONCE_ALREADY_VIEWED";
    ChatErrorCode["CHAT_VIEW_ONCE_SENDER_FORBIDDEN"] = "CHAT_VIEW_ONCE_SENDER_FORBIDDEN";
    ChatErrorCode["CHAT_VIEW_ONCE_DOWNLOAD_FORBIDDEN"] = "CHAT_VIEW_ONCE_DOWNLOAD_FORBIDDEN";
    // Ubicación en vivo
    /**
     * El compartir en vivo ya no está transmitiendo: se venció el plazo, quien
     * comparte lo cortó, o el mensaje nunca fue un compartir en vivo.
     *
     * Las tres causas contestan lo MISMO a propósito. El plazo lo hace cumplir
     * el servidor, así que un teléfono que siguió empujando posiciones después
     * de la hora llega acá — y distinguir «se venció» de «lo cortaron» no le
     * cambia nada a quien empuja, que en los dos casos tiene que dejar de
     * hacerlo.
     */
    ChatErrorCode["CHAT_LIVE_LOCATION_NOT_ACTIVE"] = "CHAT_LIVE_LOCATION_NOT_ACTIVE";
    /** Fallo genérico de las dos mutaciones del canal: empujar y cortar. */
    ChatErrorCode["CHAT_LIVE_LOCATION_FAILED"] = "CHAT_LIVE_LOCATION_FAILED";
    // Members & Groups
    ChatErrorCode["CHAT_MEMBER_NOT_FOUND"] = "CHAT_MEMBER_NOT_FOUND";
    ChatErrorCode["CHAT_MEMBER_INVALID_STATUS"] = "CHAT_MEMBER_INVALID_STATUS";
    ChatErrorCode["CHAT_ADMIN_REQUIRED"] = "CHAT_ADMIN_REQUIRED";
    ChatErrorCode["CHAT_MEMBER_ALREADY_ADMIN"] = "CHAT_MEMBER_ALREADY_ADMIN";
    ChatErrorCode["CHAT_MEMBER_NOT_ADMIN"] = "CHAT_MEMBER_NOT_ADMIN";
    ChatErrorCode["CHAT_CANNOT_KICK_SELF"] = "CHAT_CANNOT_KICK_SELF";
    ChatErrorCode["CHAT_GROUP_NOT_FOUND"] = "CHAT_GROUP_NOT_FOUND";
    ChatErrorCode["CHAT_GROUP_ALBUM_MISMATCH"] = "CHAT_GROUP_ALBUM_MISMATCH";
    ChatErrorCode["CHAT_GROUP_OWNER_REQUIRED"] = "CHAT_GROUP_OWNER_REQUIRED";
    ChatErrorCode["CHAT_USER_NOT_FOUND"] = "CHAT_USER_NOT_FOUND";
    // Pinned Messages
    ChatErrorCode["CHAT_PINNED_MESSAGE_NOT_FOUND"] = "CHAT_PINNED_MESSAGE_NOT_FOUND";
    ChatErrorCode["CHAT_PINNED_MESSAGE_FORBIDDEN"] = "CHAT_PINNED_MESSAGE_FORBIDDEN";
    /** El mensaje YA está fijado. No es un problema de permisos: dos de los tres
     * sitios que usaban `CHAT_PINNED_MESSAGE_FORBIDDEN` significaban esto, y el
     * cliente le decía «no tenés permiso» a alguien que sí lo tiene. */
    ChatErrorCode["CHAT_MESSAGE_ALREADY_PINNED"] = "CHAT_MESSAGE_ALREADY_PINNED";
    // Reactions
    ChatErrorCode["CHAT_REACTION_TOGGLE_FAILED"] = "CHAT_REACTION_TOGGLE_FAILED";
})(ChatErrorCode || (exports.ChatErrorCode = ChatErrorCode = {}));
