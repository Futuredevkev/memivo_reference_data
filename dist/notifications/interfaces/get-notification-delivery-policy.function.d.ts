import type { NotificationDeliveryPolicy } from './notification-delivery-policy.interface';
/**
 * Lookup TOLERANTE de la tabla de política.
 *
 * Existe porque el cliente no recibe un `NotificationType`: recibe lo que venga
 * en `notification.request.content.data.type`, que es `unknown` y puede ser
 * cualquier cosa —un tipo que un servidor más nuevo ya emite y este binario no
 * conoce, o basura—. Devolver `null` en ese caso es lo correcto: sin política
 * conocida, la push se muestra. Un tipo desconocido nunca se silencia.
 *
 * El servidor, que sí tiene el enum tipado, puede indexar la tabla directo.
 */
export declare const getNotificationDeliveryPolicy: (type: unknown) => NotificationDeliveryPolicy | null;
