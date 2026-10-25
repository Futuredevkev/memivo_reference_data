/**
 * Códigos de error de las notificaciones: lo que la persona pide sobre su
 * campanita.
 *
 * Nace en la ficha #68, que es la que encontró que este dominio no tenía
 * archivo: sus tres operaciones caían en `INTERNAL_SERVER_ERROR`. La tercera
 * —marcar como leído un chat— no está acá: es el mismo gesto que
 * `CHAT_MARK_AS_READ_FAILED` (abrir el chat lo deja leído), y lo que cambia es
 * qué tabla limpia el servidor, así que reutiliza ese código.
 */
export enum NotificationErrorCode {
  NOTIFICATION_MARK_READ_FAILED = 'NOTIFICATION_MARK_READ_FAILED',
  NOTIFICATION_MARK_ALL_READ_FAILED = 'NOTIFICATION_MARK_ALL_READ_FAILED',
}
