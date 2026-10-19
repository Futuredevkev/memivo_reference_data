/**
 * Códigos de error del módulo de álbumes
 */
export enum AlbumErrorCode {
  ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND',
  ALBUM_PERMISSION_DENIED = 'ALBUM_PERMISSION_DENIED',
  ALBUM_OWNER_REQUIRED = 'ALBUM_OWNER_REQUIRED',
  ALBUM_ORGANIZER_REQUIRED = 'ALBUM_ORGANIZER_REQUIRED',
  ALBUM_INVITE_INVALID = 'ALBUM_INVITE_INVALID',
  ALBUM_INVITE_EXPIRED = 'ALBUM_INVITE_EXPIRED',
  /**
   * El `qrCode` del álbum venció. Es una puerta DISTINTA de
   * `ALBUM_INVITE_EXPIRED` —ésa es el token de invitación— y tiene otro
   * remedio: el invite se vuelve a mandar, el qrCode lo tiene que rotar el
   * organizador. Sin código propio el único emisor posible era el 404 de
   * `ALBUM_NOT_FOUND`, y ahí el cliente no puede distinguir «este código
   * expiró, pedile uno nuevo al organizador» de «este álbum no existe».
   */
  ALBUM_QR_CODE_EXPIRED = 'ALBUM_QR_CODE_EXPIRED',
  ALBUM_OWNER_SCAN_FORBIDDEN = 'ALBUM_OWNER_SCAN_FORBIDDEN',
  ALBUM_PASSWORD_REQUIRED = 'ALBUM_PASSWORD_REQUIRED',
  ALBUM_PASSWORD_INVALID = 'ALBUM_PASSWORD_INVALID',
  ALBUM_NOT_SCANNED = 'ALBUM_NOT_SCANNED',
  /**
   * El álbum existe, está entero, y Memivo lo apagó.
   *
   * ── A QUIÉN SE LE DICE, Y POR QUÉ SÓLO A ÉL ───────────────────────────────
   * **Sólo a quien organiza el álbum.** A cualquier otro —miembro o no— la
   * ausencia se le cuenta con la voz colapsada de siempre, que no distingue
   * causas: separar «no existe» de «existe pero no podés verlo» es
   * exactamente el dato que no hay que dar.
   *
   * Con quien organiza no aplica ese motivo: **ya sabe que su álbum existía**,
   * así que decirle la causa no le revela nada de nadie. Y sin este código no
   * hay a dónde mandarlo: el corpus legal promete revisión, y una revisión sin
   * dirección a la que escribir es una promesa sin camino.
   *
   * ── LA TRAMPA, ESCRITA ────────────────────────────────────────────────────
   * Del lado del cliente la tabla de voz de ausencia se llavea por la FORMA del
   * nombre —`…_NOT_FOUND` y `…_EXPIRED`—, así que éste **no entra solo**: hay
   * que anotarlo a mano en la lista de códigos sin forma. Es un techo conocido
   * y está declarado ahí.
   */
  ALBUM_SUSPENDED = 'ALBUM_SUSPENDED',
  PARTICIPANT_NOT_FOUND = 'PARTICIPANT_NOT_FOUND',
  /**
   * El álbum existe, la persona es miembro, y AHORA MISMO no admite
   * publicaciones suyas: o el interruptor está en «sólo organizadores», o hay
   * una ventana horaria y estamos afuera.
   *
   * ── POR QUÉ VIAJA CON 409 Y NO CON 403 ────────────────────────────────────
   * Porque el status no es decoración: el cliente colapsa **cualquier 403** en
   * «este contenido ya no está» y de ahí deriva SALIR DE LA PANTALLA. Con un
   * 403, intentar publicar con el feed cerrado echaría del álbum a quien lo
   * intentó — no un texto feo, otra conducta. Y el 409 además dice la verdad:
   * no es que falte autoridad sobre el recurso, es que el recurso está en un
   * estado que ahora no admite esto.
   *
   * ── EL SOBRE LLEVA LA LLAVE, NO LA FRASE ──────────────────────────────────
   * Viaja con el motivo y, si lo hay, el próximo borde en instante absoluto. La
   * frase la arma el cliente contra el contrato. Nada de fechas interpoladas en
   * el mensaje del servidor: una fecha formateada en el servidor sale en el
   * idioma del servidor y en la zona del servidor.
   *
   * NO entra a la tabla de voz de ausencia del cliente: esto no es contenido
   * que falta, y todos los miembros ven el mismo estado del álbum.
   */
  ALBUM_POSTING_CLOSED = 'ALBUM_POSTING_CLOSED',
  /**
   * Quien pide no puede avisarle a todo el álbum ahora: no organiza, el álbum
   * está oculto, hubo un aviso hace poco, se llegó al máximo del día, o esta
   * publicación ya avisó.
   *
   * ── 409 Y NO 403, POR LO MISMO QUE `ALBUM_POSTING_CLOSED` ─────────────────
   * El cliente colapsa cualquier 403 en «este contenido ya no está» y sale de
   * la pantalla: con un 403, tocar «Avisar a todos» en el menú de un post
   * echaría del álbum a quien lo tocó. Y el 409 dice la verdad: el recurso
   * existe y está en un estado que ahora no admite esto.
   *
   * ── EL SOBRE LLEVA LA LLAVE Y EL INSTANTE ─────────────────────────────────
   * `announcementUnavailableReason` y `announcementNextAvailableAt`, nunca la
   * frase: el cliente la arma con su vocabulario de tiempo. Sólo lo emite la
   * puerta explícita; al crear una publicación el aviso que no sale no es un
   * error —la publicación se crea igual— y viaja en la respuesta.
   */
  ALBUM_ANNOUNCEMENT_UNAVAILABLE = 'ALBUM_ANNOUNCEMENT_UNAVAILABLE',

  // ── LA OPERACIÓN QUE PIDIÓ LA PERSONA FALLÓ POR ALGO INESPERADO ──────────
  // Una familia por operación, con el sufijo `_FAILED` y status 500: la base
  // que no contesta, un timeout. Antes las quince caían en
  // `INTERNAL_SERVER_ERROR` y quien creaba un álbum o entraba a uno leía
  // «Error interno del servidor» en vez de qué fue lo que no se pudo hacer.
  // Cada código nombra la operación del BORDE —lo que la persona pidió—, no un
  // paso de adentro: un colaborador no acuña código.
  ALBUM_ENTRY_FAILED = 'ALBUM_ENTRY_FAILED',
  ALBUM_LEAVE_FAILED = 'ALBUM_LEAVE_FAILED',
  ALBUM_CREATE_FAILED = 'ALBUM_CREATE_FAILED',
  ALBUM_UPDATE_FAILED = 'ALBUM_UPDATE_FAILED',
  ALBUM_DELETE_FAILED = 'ALBUM_DELETE_FAILED',
  ALBUM_VISIBILITY_UPDATE_FAILED = 'ALBUM_VISIBILITY_UPDATE_FAILED',
  ALBUM_POSTING_UPDATE_FAILED = 'ALBUM_POSTING_UPDATE_FAILED',
  /**
   * Renovar el acceso o extender el vencimiento del código: las dos puertas
   * mueven el MISMO eje —quién puede entrar con lo que ya se repartió— y una
   * persona que las usa no distingue una de la otra al fallar. Dos códigos para
   * el mismo eje serían el duplicado que este catálogo persigue.
   */
  ALBUM_ACCESS_UPDATE_FAILED = 'ALBUM_ACCESS_UPDATE_FAILED',
  ALBUM_SHARE_INVITE_CREATE_FAILED = 'ALBUM_SHARE_INVITE_CREATE_FAILED',
  ALBUM_POST_SHARE_INVITE_CREATE_FAILED = 'ALBUM_POST_SHARE_INVITE_CREATE_FAILED',
  ALBUM_INVITE_PREVIEW_FAILED = 'ALBUM_INVITE_PREVIEW_FAILED',
  ALBUM_INVITE_REDEEM_FAILED = 'ALBUM_INVITE_REDEEM_FAILED',
  ALBUM_ORGANIZER_PROMOTE_FAILED = 'ALBUM_ORGANIZER_PROMOTE_FAILED',
  ALBUM_ORGANIZER_DEMOTE_FAILED = 'ALBUM_ORGANIZER_DEMOTE_FAILED',
  ALBUM_PARTICIPANT_REMOVE_FAILED = 'ALBUM_PARTICIPANT_REMOVE_FAILED',
}
