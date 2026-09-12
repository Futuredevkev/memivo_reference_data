export enum NotificationType {
  LIKE_PHOTO = 'LIKE_PHOTO',
  COMMENT_PHOTO = 'COMMENT_PHOTO',
  REPLY_COMMENT = 'REPLY_COMMENT',
  CHAT_INVITATION = 'CHAT_INVITATION',
  NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE',
  CHAT_MESSAGE_REPLY = 'CHAT_MESSAGE_REPLY',
  PROFESSIONAL_PHOTOS_UPLOADED = 'PROFESSIONAL_PHOTOS_UPLOADED',
  TAGGED_IN_PHOTO = 'TAGGED_IN_PHOTO',
  POLL_CREATED = 'POLL_CREATED',
  MEMBER_KICKED = 'MEMBER_KICKED',
  CHAT_MEMBER_KICKED = 'CHAT_MEMBER_KICKED',
  ALBUM_DELETED = 'ALBUM_DELETED',
  ALBUM_HIDDEN = 'ALBUM_HIDDEN',
  CHAT_GROUP_DELETED = 'CHAT_GROUP_DELETED',
  MEMBER_PROMOTED_ADMIN = 'MEMBER_PROMOTED_ADMIN',
  MEMBER_DEMOTED_ADMIN = 'MEMBER_DEMOTED_ADMIN',
  ALBUM_ORGANIZER_PROMOTED = 'ALBUM_ORGANIZER_PROMOTED',
  ALBUM_ORGANIZER_REMOVED = 'ALBUM_ORGANIZER_REMOVED',
  ALBUM_OWNERSHIP_TRANSFERRED = 'ALBUM_OWNERSHIP_TRANSFERRED',
  CHAT_GROUP_OWNERSHIP_TRANSFERRED = 'CHAT_GROUP_OWNERSHIP_TRANSFERRED',
  REACTION_COMMENT = 'REACTION_COMMENT',
  REACTION_RESPONSE = 'REACTION_RESPONSE',
  CHAT_MESSAGE_REACTION = 'CHAT_MESSAGE_REACTION',
  HIGHLIGHTS_REMINDER = 'HIGHLIGHTS_REMINDER',
  MEMIVO_MOMENTS = 'MEMIVO_MOMENTS',
  TAGGED_IN_STORY = 'TAGGED_IN_STORY',
  STORY_COMMENT = 'STORY_COMMENT',
  DAILY_MOTIVATIONAL = 'DAILY_MOTIVATIONAL',
  GUEST_POST_UPLOAD_READY = 'GUEST_POST_UPLOAD_READY',
  PROFESSIONAL_PHOTOS_UPLOAD_READY = 'PROFESSIONAL_PHOTOS_UPLOAD_READY',
  STORY_UPLOAD_READY = 'STORY_UPLOAD_READY',
  DOWNLOAD_READY = 'DOWNLOAD_READY',
  GUEST_POST_UPLOAD_FAILED = 'GUEST_POST_UPLOAD_FAILED',
  PROFESSIONAL_PHOTOS_UPLOAD_FAILED = 'PROFESSIONAL_PHOTOS_UPLOAD_FAILED',
  STORY_UPLOAD_FAILED = 'STORY_UPLOAD_FAILED',
  CHAT_MEDIA_UPLOAD_FAILED = 'CHAT_MEDIA_UPLOAD_FAILED',
  ALBUM_MODERATION_ALERT = 'ALBUM_MODERATION_ALERT',
  CONTENT_REMOVED_BY_ORGANIZER = 'CONTENT_REMOVED_BY_ORGANIZER',
  ALBUM_QR_CODE_EXPIRING = 'ALBUM_QR_CODE_EXPIRING',
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
  CONTENT_REMOVED_BY_MEMIVO = 'CONTENT_REMOVED_BY_MEMIVO',
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
  ALBUM_SUSPENDED_BY_MEMIVO = 'ALBUM_SUSPENDED_BY_MEMIVO',
  /**
   * Memivo restableció tu álbum.
   *
   * Va con su hermano y no después: un aviso que dice «suspendimos tu álbum»
   * sin contraparte deja a la persona con una acusación en pie y sin forma de
   * saber que se levantó. La reversión se cuenta, igual que se cuenta la
   * sanción.
   */
  ALBUM_REINSTATED_BY_MEMIVO = 'ALBUM_REINSTATED_BY_MEMIVO',
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
  WARNING_ISSUED_BY_MEMIVO = 'WARNING_ISSUED_BY_MEMIVO',
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
  MENTIONED_IN_COMMENT = 'MENTIONED_IN_COMMENT',
  /** Te mencionaron en una respuesta a un comentario. Ver `MENTIONED_IN_COMMENT`. */
  MENTIONED_IN_REPLY = 'MENTIONED_IN_REPLY',
  /** Te mencionaron en un comentario de una historia. Ver `MENTIONED_IN_COMMENT`. */
  MENTIONED_IN_STORY_COMMENT = 'MENTIONED_IN_STORY_COMMENT',
  /**
   * Te mencionaron en un mensaje de un grupo de chat. Ver `MENTIONED_IN_COMMENT`.
   *
   * Cuenta en el globo del CHAT y no en la campanita —está en
   * `CHAT_NOTIFICATION_TYPES`—, porque para esa persona reemplaza al aviso
   * genérico del mensaje, que también cuenta ahí.
   */
  MENTIONED_IN_CHAT_MESSAGE = 'MENTIONED_IN_CHAT_MESSAGE',
  /**
   * Respondieron a TU respuesta: alguien eligió «Responder» sobre una respuesta
   * tuya adentro de un hilo de comentarios.
   *
   * ── POR QUÉ NO REUSA `REPLY_COMMENT` ─────────────────────────────────────
   * Porque aquel dice «respondió a tu comentario», y para el autor de una
   * RESPUESTA eso es falso: el comentario es de otro. Es la regla que este enum
   * ya dejó escrita en `CONTENT_REMOVED_BY_MEMIVO` —no se reusa un tipo cuyo
   * texto le miente a quien lo recibe— y la misma partición que el chat tiene
   * entre `CHAT_MESSAGE_REPLY` y `NEW_CHAT_MESSAGE`.
   *
   * ── UN AVISO POR PERSONA Y POR HECHO ─────────────────────────────────────
   * Si además te mencionan en esa respuesta gana `MENTIONED_IN_REPLY`, y si sos
   * a la vez el citado y el dueño del comentario recibís éste y no
   * `REPLY_COMMENT`: el más específico. El colapso lo hace el servidor al elegir
   * destinatarios.
   *
   * Lleva la metadata de `REPLY_COMMENT`, con `responseId` = la respuesta NUEVA:
   * el toque lleva a lo que se escribió, no a lo que se citó.
   */
  REPLY_RESPONSE = 'REPLY_RESPONSE',
  /**
   * Alguien comentó una publicación ajena en la que vos ya habías comentado.
   *
   * ── EL DEFECTO QUE CIERRA ────────────────────────────────────────────────
   * Ese aviso ya existía, pero viajaba como `COMMENT_PHOTO`, cuyo texto dice
   * «comentó tu publicación»: a quien sólo había comentado le afirmaba que el
   * post era suyo. A quién se le avisa es una decisión escrita del servidor —a
   * los que ya participan del hilo, mientras sigan en el álbum— y no cambió; lo
   * que cambió es la voz, que ahora es verdadera.
   *
   * Es el último de la precedencia: el dueño del post recibe `COMMENT_PHOTO`, y
   * el mencionado, la mención.
   */
  COMMENT_ON_COMMENTED_POST = 'COMMENT_ON_COMMENTED_POST',
  /**
   * Alguien respondió en una publicación en la que vos comentaste, sin
   * responderte a vos ni a tu comentario.
   *
   * Es el mismo defecto que `COMMENT_ON_COMMENTED_POST`, del lado de las
   * respuestas: viajaba como `REPLY_COMMENT` y le decía «respondió a tu
   * comentario» a quien no era el dueño del comentario respondido.
   */
  REPLY_ON_COMMENTED_POST = 'REPLY_ON_COMMENTED_POST',
}
