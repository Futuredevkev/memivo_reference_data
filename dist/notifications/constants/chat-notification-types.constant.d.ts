import { NotificationType } from '../enums';
/**
 * Tipos de notificación del módulo Chat/Mensajería. Separan el contador de la
 * campanita (Social) del de la burbuja (Chat). API y cliente deben clasificar
 * IGUAL: la API parte los contadores en SQL y el cliente parte los badges, y
 * ambos dependen del índice parcial de notificaciones en la base.
 *
 * ⚠️ Ese índice (`IDX_notifications_bell`) escribe esta misma lista como
 * literales SQL en su predicado. Sumar un tipo acá sin recrear el índice deja
 * la campanita leyendo filas que el índice no excluye: es drift entre dos
 * copias de la misma decisión, y la migración que agrega el tipo lo recrea.
 *
 * `MENTIONED_IN_CHAT_MESSAGE` está porque para el mencionado REEMPLAZA a
 * `NEW_CHAT_MESSAGE`: si contara en la campanita, la mención de un mensaje
 * aparecería en el lugar donde los mensajes no aparecen, y faltaría en el globo
 * donde sí.
 */
export declare const CHAT_NOTIFICATION_TYPES: readonly [NotificationType.NEW_CHAT_MESSAGE, NotificationType.CHAT_MESSAGE_REPLY, NotificationType.MENTIONED_IN_CHAT_MESSAGE];
