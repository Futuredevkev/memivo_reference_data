/**
 * Las superficies in-app que pueden SUSTITUIR a una push. Es un catálogo
 * cerrado y no un string libre justamente para que no derive en prosa: si una
 * superficie no está acá, no existe, y por lo tanto no se puede usar como
 * excusa para silenciar una notificación.
 *
 * Su razón de ser es el gate. `NOTIFICATION_DELIVERY_POLICY` exige nombrar una
 * de éstas cada vez que se suprime algo, y el test de la tabla lo verifica: es
 * lo que impide que suprimir se vuelva "sacarlo y ya".
 */
export type NotificationInAppSurface =
  /** La lista de posts del álbum, que se actualiza en vivo por socket. */
  | 'album-feed'
  /** El banner de Momentos arriba del feed. */
  | 'album-moments-banner'
  /** La lista de chats (el grupo aparece/desaparece solo). */
  | 'chat-list'
  /** La burbuja optimista del mensaje, con su estado de envío/error. */
  | 'chat-message-bubble'
  /** La sala abierta: mensaje de sistema en el hilo, o toast + salida. */
  | 'chat-room'
  /** Toast disparado por el socket global, visible en cualquier pantalla. */
  | 'global-toast'
  /** La pantalla de detalle del post (o el modal de comentarios). */
  | 'post-detail'
  /** El visor de historias abierto en esa historia. */
  | 'story-viewer'
  /**
   * El estado de una transferencia PINTADO SOBRE EL PROPIO CONTENIDO: el
   * porcentaje encima de la foto que se sube o se baja, del círculo de la
   * historia, de la tarjeta de la carpeta, y el ícono de reintentar sobre lo
   * que falló.
   *
   * Reemplaza a `upload-tray` y `download-tray`, que nombraban dos paneles
   * flotantes en la raíz de la app. Los dos se borraron: un panel en la raíz es
   * INVISIBLE bajo cualquier ventana modal —o sea bajo el visor de historias y
   * el de fotos, que es justo donde el usuario está cuando sube algo—, así que
   * la sustitución que prometían no se cumplía nunca ahí. El nombre nuevo
   * describe dónde vive el estado hoy.
   */
  | 'transfer-on-content';
