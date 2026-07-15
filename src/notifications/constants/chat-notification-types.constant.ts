import { NotificationType } from '../enums';

/**
 * Tipos de notificación del módulo Chat/Mensajería. Separan el contador de la
 * campanita (Social) del de la burbuja (Chat). API y cliente deben clasificar
 * IGUAL: la API parte los contadores en SQL y el cliente parte los badges, y
 * ambos dependen del índice parcial de notificaciones en la base.
 */
export const CHAT_NOTIFICATION_TYPES = [
  NotificationType.NEW_CHAT_MESSAGE,
  NotificationType.CHAT_MESSAGE_REPLY,
] as const;
