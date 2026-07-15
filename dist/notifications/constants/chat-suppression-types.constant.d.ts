import { NotificationType } from '../enums';
/**
 * Catálogos de supresión de push por "contexto ya en pantalla". Si el usuario
 * está viendo el chat/post/story al que apunta la notificación, es redundante:
 * la API saltea el push (`viewsSuppressNotification`) y el cliente suprime el
 * banner en foreground (`shouldSuppressForegroundNotification`). AMBOS lados
 * deben decidir sobre el MISMO conjunto de tipos; agregar un tipo suprimible en
 * un solo lado rompe el contrato en silencio. Cada consumidor envuelve estos
 * arrays en un `Set` local para el test de pertenencia.
 */
export declare const CHAT_SUPPRESSION_TYPES: readonly [NotificationType.NEW_CHAT_MESSAGE, NotificationType.CHAT_MESSAGE_REPLY, NotificationType.CHAT_MESSAGE_REACTION, NotificationType.POLL_CREATED];
