import { NotificationType } from '../enums';
import type { NotificationDeliveryPolicy } from '../interfaces/notification-delivery-policy.interface';
/**
 * LA TABLA. Una fila por tipo de notificación: qué hace esa push cuando la app
 * del destinatario está viva.
 *
 * Es la fuente ÚNICA de la que salen todas las decisiones de supresión de los
 * dos lados del cable. Antes estaban repartidas en seis catálogos y dos
 * implementaciones espejadas a mano —`CHAT/POST/STORY/REACTION_POST_SUPPRESSION_TYPES`,
 * `FOREGROUND_SUPPRESSED_NOTIFICATION_TYPES` y `PUSH_ONLY_NOTIFICATION_TYPES`—,
 * y agregar un tipo al enum no obligaba a nadie a decidir nada: 24 de los 37
 * entraron sin una sola línea escrita sobre qué debía pasar con ellos.
 *
 * Ahora el `Record` es EXHAUSTIVO: un tipo nuevo en `NotificationType` sin fila
 * acá **no compila**. Ésa es toda la idea.
 *
 * Y la contracara, que la verifica `notification-delivery-policy.test.js`:
 * suprimir exige nombrar la superficie in-app que sustituye a la push
 * (`replacedBy`). No se puede callar algo sin decir quién lo dice en su lugar.
 */
export declare const NOTIFICATION_DELIVERY_POLICY: Readonly<Record<NotificationType, NotificationDeliveryPolicy>>;
