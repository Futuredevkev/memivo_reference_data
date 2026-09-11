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
     * Memivo restableció tu álbum.
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
    WARNING_ISSUED_BY_MEMIVO = "WARNING_ISSUED_BY_MEMIVO",
    /**
     * Tu plan está por vencer.
     *
     * ── POR QUÉ EXISTE: NO VENDE, RETIENE ───────────────────────────────────
     * Sin esto, la primera baja involuntaria se descubre **chocando contra un
     * paywall**: el derecho se apaga solo cuando el vencimiento pasa —no hay
     * columna espejo que nadie tenga que escribir—, así que del lado de la
     * persona no ocurre ningún evento. Un día crea un álbum y le dicen que llegó
     * al tope de tres. Ese es el peor momento posible para enterarse.
     *
     * ── POR QUÉ NO SE ACUÑÓ `PLAN_EXPIRED` ──────────────────────────────────
     * Porque el aviso tiene que llegar ANTES. Después no es un aviso, es un
     * parte de daños — el mismo razonamiento que su hermano del código de
     * acceso. Y además el sufijo `_EXPIRED` cae a la vez en las dos familias que
     * el cliente clasifica por sufijo, cosa que el modelo ya dejó escrita.
     *
     * ── NO NOMBRA A NADIE NI A NINGÚN ÁLBUM ─────────────────────────────────
     * Habla del plan del destinatario y de nada más, así que no hay identidad
     * ajena que filtrar ni bloqueo que aplicar. Por eso su metadata es `never`.
     */
    PLAN_EXPIRING_SOON = "PLAN_EXPIRING_SOON",
    /**
     * Te mencionaron en un comentario de un post.
     *
     * ── POR QUÉ UN TIPO POR SUPERFICIE Y NO UN `MENTION` ÚNICO ────────────────
     * Porque la política de entrega se llavea por tipo y cada superficie la
     * decide distinto: qué pantalla vuelve redundante al aviso (el post, el visor
     * de historias, la sala), y si cuenta en la campanita o en el globo del chat.
     * Un tipo único obligaría a mirar la metadata para decidir la fila, que es la
     * tabla partida en dos lugares. Es la misma partición que ya tienen
     * `COMMENT_PHOTO`, `STORY_COMMENT` y `NEW_CHAT_MESSAGE`.
     *
     * ── LA MENCIÓN NO ES UN CANAL PRIVILEGIADO ────────────────────────────────
     * Decisión del dueño: respeta el silenciado como cualquier aviso del hilo.
     * Y cuando el mismo hecho te dispararía también el aviso propio de la
     * superficie (comentaron tu post), recibís UNO solo, el de la mención, que es
     * el más específico. El colapso lo hace el servidor al elegir destinatarios.
     */
    MENTIONED_IN_COMMENT = "MENTIONED_IN_COMMENT",
    /** Te mencionaron en una respuesta a un comentario. Ver `MENTIONED_IN_COMMENT`. */
    MENTIONED_IN_REPLY = "MENTIONED_IN_REPLY",
    /** Te mencionaron en un comentario de una historia. Ver `MENTIONED_IN_COMMENT`. */
    MENTIONED_IN_STORY_COMMENT = "MENTIONED_IN_STORY_COMMENT",
    /**
     * Te mencionaron en un mensaje de un grupo de chat. Ver `MENTIONED_IN_COMMENT`.
     *
     * Cuenta en el globo del CHAT y no en la campanita —está en
     * `CHAT_NOTIFICATION_TYPES`—, porque para esa persona reemplaza al aviso
     * genérico del mensaje, que también cuenta ahí.
     */
    MENTIONED_IN_CHAT_MESSAGE = "MENTIONED_IN_CHAT_MESSAGE"
}
