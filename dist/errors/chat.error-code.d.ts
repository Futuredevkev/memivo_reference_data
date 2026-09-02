/**
 * Códigos de error del módulo de chat
 */
export declare enum ChatErrorCode {
    CHAT_FILE_NOT_FOUND = "CHAT_FILE_NOT_FOUND",
    CHAT_MESSAGE_NOT_FOUND = "CHAT_MESSAGE_NOT_FOUND",
    CHAT_MESSAGE_FORBIDDEN = "CHAT_MESSAGE_FORBIDDEN",
    CHAT_MESSAGE_EDIT_UNSUPPORTED = "CHAT_MESSAGE_EDIT_UNSUPPORTED",
    CHAT_MEDIA_MISMATCH = "CHAT_MEDIA_MISMATCH",
    CHAT_MESSAGE_EMPTY = "CHAT_MESSAGE_EMPTY",
    CHAT_MESSAGE_SEND_FAILED = "CHAT_MESSAGE_SEND_FAILED",
    /**
     * El mensaje no puede mudarse a otro chat: o lo construyó la app —un
     * aviso de sistema, una encuesta— o está atado a su chat por un estado
     * suyo, como el view-once. Quién cae de cada lado lo decide
     * `CHAT_CONTENT_RELOCATION_BY_TYPE`, y la app pregunta ANTES de ofrecer
     * el botón: llegar acá significa una request armada a mano.
     */
    CHAT_MESSAGE_NOT_RELOCATABLE = "CHAT_MESSAGE_NOT_RELOCATABLE",
    CHAT_VIDEO_TOO_LONG = "CHAT_VIDEO_TOO_LONG",
    CHAT_AUDIO_TOO_LONG = "CHAT_AUDIO_TOO_LONG",
    CHAT_MESSAGE_EDIT_FAILED = "CHAT_MESSAGE_EDIT_FAILED",
    CHAT_MESSAGE_DELETE_FAILED = "CHAT_MESSAGE_DELETE_FAILED",
    CHAT_MESSAGE_DELETE_MEDIA_FAILED = "CHAT_MESSAGE_DELETE_MEDIA_FAILED",
    CHAT_MARK_AS_READ_FAILED = "CHAT_MARK_AS_READ_FAILED",
    CHAT_VIEW_ONCE_EXPIRED = "CHAT_VIEW_ONCE_EXPIRED",
    CHAT_VIEW_ONCE_ALREADY_VIEWED = "CHAT_VIEW_ONCE_ALREADY_VIEWED",
    CHAT_VIEW_ONCE_SENDER_FORBIDDEN = "CHAT_VIEW_ONCE_SENDER_FORBIDDEN",
    CHAT_VIEW_ONCE_DOWNLOAD_FORBIDDEN = "CHAT_VIEW_ONCE_DOWNLOAD_FORBIDDEN",
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
    CHAT_LIVE_LOCATION_NOT_ACTIVE = "CHAT_LIVE_LOCATION_NOT_ACTIVE",
    /** Fallo genérico de las dos mutaciones del canal: empujar y cortar. */
    CHAT_LIVE_LOCATION_FAILED = "CHAT_LIVE_LOCATION_FAILED",
    CHAT_MEMBER_NOT_FOUND = "CHAT_MEMBER_NOT_FOUND",
    CHAT_MEMBER_INVALID_STATUS = "CHAT_MEMBER_INVALID_STATUS",
    CHAT_ADMIN_REQUIRED = "CHAT_ADMIN_REQUIRED",
    CHAT_MEMBER_ALREADY_ADMIN = "CHAT_MEMBER_ALREADY_ADMIN",
    CHAT_MEMBER_NOT_ADMIN = "CHAT_MEMBER_NOT_ADMIN",
    CHAT_CANNOT_KICK_SELF = "CHAT_CANNOT_KICK_SELF",
    CHAT_GROUP_NOT_FOUND = "CHAT_GROUP_NOT_FOUND",
    CHAT_GROUP_ALBUM_MISMATCH = "CHAT_GROUP_ALBUM_MISMATCH",
    CHAT_GROUP_OWNER_REQUIRED = "CHAT_GROUP_OWNER_REQUIRED",
    CHAT_USER_NOT_FOUND = "CHAT_USER_NOT_FOUND",
    CHAT_PINNED_MESSAGE_NOT_FOUND = "CHAT_PINNED_MESSAGE_NOT_FOUND",
    CHAT_PINNED_MESSAGE_FORBIDDEN = "CHAT_PINNED_MESSAGE_FORBIDDEN",
    /** El mensaje YA está fijado. No es un problema de permisos: dos de los tres
     * sitios que usaban `CHAT_PINNED_MESSAGE_FORBIDDEN` significaban esto, y el
     * cliente le decía «no tenés permiso» a alguien que sí lo tiene. */
    CHAT_MESSAGE_ALREADY_PINNED = "CHAT_MESSAGE_ALREADY_PINNED",
    CHAT_REACTION_TOGGLE_FAILED = "CHAT_REACTION_TOGGLE_FAILED",
    /**
     * Falló ABRIR un mensaje de una sola vista, por algo imprevisto.
     *
     * Los cuatro `CHAT_VIEW_ONCE_*` de arriba nombran CONDICIONES —venció, ya se
     * vio, no lo puede abrir quien lo mandó, no se puede descargar— y las cuatro
     * las tira a mano el validador. Faltaba el «falló la operación».
     *
     * Sin él ese camino prestaba `CHAT_MESSAGE_SEND_FAILED`, que el filtro
     * global conserva y el cliente traduce «No se pudo enviar el mensaje.»: una
     * frase FALSA sobre una operación que estaba abriendo, no enviando. Un
     * código prestado es peor que el genérico — el genérico no afirma nada.
     */
    CHAT_VIEW_ONCE_OPEN_FAILED = "CHAT_VIEW_ONCE_OPEN_FAILED"
}
