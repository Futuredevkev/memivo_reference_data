export declare enum NotificationType {
    LIKE_PHOTO = "LIKE_PHOTO",
    COMMENT_PHOTO = "COMMENT_PHOTO",
    REPLY_COMMENT = "REPLY_COMMENT",
    CHAT_INVITATION = "CHAT_INVITATION",
    NEW_CHAT_MESSAGE = "NEW_CHAT_MESSAGE",
    CHAT_MESSAGE_REPLY = "CHAT_MESSAGE_REPLY",
    PROFESSIONAL_PHOTOS_UPLOADED = "PROFESSIONAL_PHOTOS_UPLOADED",
    TAGGED_IN_PHOTO = "TAGGED_IN_PHOTO",
    POLL_CREATED = "POLL_CREATED",
    MEMBER_KICKED = "MEMBER_KICKED",
    CHAT_MEMBER_KICKED = "CHAT_MEMBER_KICKED",
    ALBUM_DELETED = "ALBUM_DELETED",
    ALBUM_HIDDEN = "ALBUM_HIDDEN",
    CHAT_GROUP_DELETED = "CHAT_GROUP_DELETED",
    MEMBER_PROMOTED_ADMIN = "MEMBER_PROMOTED_ADMIN",
    MEMBER_DEMOTED_ADMIN = "MEMBER_DEMOTED_ADMIN",
    ALBUM_ORGANIZER_PROMOTED = "ALBUM_ORGANIZER_PROMOTED",
    ALBUM_ORGANIZER_REMOVED = "ALBUM_ORGANIZER_REMOVED",
    ALBUM_OWNERSHIP_TRANSFERRED = "ALBUM_OWNERSHIP_TRANSFERRED",
    CHAT_GROUP_OWNERSHIP_TRANSFERRED = "CHAT_GROUP_OWNERSHIP_TRANSFERRED",
    REACTION_COMMENT = "REACTION_COMMENT",
    REACTION_RESPONSE = "REACTION_RESPONSE",
    CHAT_MESSAGE_REACTION = "CHAT_MESSAGE_REACTION",
    HIGHLIGHTS_REMINDER = "HIGHLIGHTS_REMINDER",
    MEMIVO_MOMENTS = "MEMIVO_MOMENTS",
    TAGGED_IN_STORY = "TAGGED_IN_STORY",
    STORY_COMMENT = "STORY_COMMENT",
    DAILY_MOTIVATIONAL = "DAILY_MOTIVATIONAL",
    GUEST_POST_UPLOAD_READY = "GUEST_POST_UPLOAD_READY",
    PROFESSIONAL_PHOTOS_UPLOAD_READY = "PROFESSIONAL_PHOTOS_UPLOAD_READY",
    STORY_UPLOAD_READY = "STORY_UPLOAD_READY",
    DOWNLOAD_READY = "DOWNLOAD_READY",
    GUEST_POST_UPLOAD_FAILED = "GUEST_POST_UPLOAD_FAILED",
    PROFESSIONAL_PHOTOS_UPLOAD_FAILED = "PROFESSIONAL_PHOTOS_UPLOAD_FAILED",
    STORY_UPLOAD_FAILED = "STORY_UPLOAD_FAILED",
    CHAT_MEDIA_UPLOAD_FAILED = "CHAT_MEDIA_UPLOAD_FAILED",
    ALBUM_MODERATION_ALERT = "ALBUM_MODERATION_ALERT",
    CONTENT_REMOVED_BY_ORGANIZER = "CONTENT_REMOVED_BY_ORGANIZER",
    ALBUM_QR_CODE_EXPIRING = "ALBUM_QR_CODE_EXPIRING",
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
    CONTENT_REMOVED_BY_MEMIVO = "CONTENT_REMOVED_BY_MEMIVO",
    /**
     * Memivo apagó tu álbum entero, por su propia autoridad.
     *
     * ── EL DEFECTO QUE CIERRA ──────────────────────────────────
     * La suspensión de álbum nació sin aviso: al dueño y a los organizadores no
     * les llegaba nada —ni push, ni campanita, ni correo— y se enteraban porque
     * cada request les contestaba un error. El corpus legal les promete que
     * pueden pedir revisión, y **no tenían cómo saber a quién escribirle, porque
     * no sabían que había sido Memivo.** Una sanción silenciosa no es apelable.
     *
     * ── POR QUÉ NO REUSA `ALBUM_HIDDEN` ─────────────────────────────
     * Porque aquel dice que el álbum dejó de estar visible y va a los MIEMBROS,
     * con actor anónimo, y su docblock apoya esa decisión en que quien organiza
     * no pierde el acceso. Bajo suspensión el organizador **sí** lo pierde, y lo
     * que necesita leer no es «el álbum se ocultó» sino quién lo apagó y a dónde
     * reclamar. Es el mismo razonamiento por el que la remoción de plataforma no
     * reusa la del organizador.
     */
    ALBUM_SUSPENDED_BY_MEMIVO = "ALBUM_SUSPENDED_BY_MEMIVO",
    /**
     * Memivo volvió a prender tu álbum.
     *
     * Va con su hermano y no después: un aviso que dice «suspendimos tu álbum»
     * sin contraparte deja a la persona con una acusación en pie y sin forma de
     * saber que se levantó. La reversión se cuenta, igual que se cuenta la
     * sanción.
     */
    ALBUM_REINSTATED_BY_MEMIVO = "ALBUM_REINSTATED_BY_MEMIVO",
    /**
     * Memivo te advirtió por algo que publicás o hacés.
     *
     * ── POR QUÉ EXISTE ──────────────────────────────────────────
     * La advertencia es una de las cuatro sanciones que los Términos y las Normas
     * de Comunidad publican, y era **la única sin mecanismo**: no existía ni como
     * acción de expediente ni como aviso. Sin ella toda decisión de moderación
     * sobre una persona es todo-o-nada —la primera vez, o no se hace nada o se
     * banea—, que es el mismo problema que dio origen a la ola de derechos de
     * autor y que allá se cerró para el CONTENIDO y quedó abierto para la PERSONA.
     *
     * Y sin advertencia no hay reincidencia: no queda registro de la primera vez.
     */
    WARNING_ISSUED_BY_MEMIVO = "WARNING_ISSUED_BY_MEMIVO"
}
