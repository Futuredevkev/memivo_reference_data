"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationDeliveryPolicy = void 0;
const notification_delivery_policy_constant_1 = require("../constants/notification-delivery-policy.constant");
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
const getNotificationDeliveryPolicy = (type) => {
    if (typeof type !== 'string')
        return null;
    const table = notification_delivery_policy_constant_1.NOTIFICATION_DELIVERY_POLICY;
    return table[type] ?? null;
};
exports.getNotificationDeliveryPolicy = getNotificationDeliveryPolicy;
