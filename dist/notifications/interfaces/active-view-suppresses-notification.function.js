"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeViewSuppressesNotification = void 0;
const resolve_notification_context_id_function_1 = require("./resolve-notification-context-id.function");
/**
 * Si una pantalla abierta vuelve redundante a esta push.
 *
 * Es la ÚNICA implementación del cruce política × contexto, y la corren los dos
 * lados: el servidor la aplica sobre cada `ActiveView` que le reportó la
 * presencia del socket, y el cliente sobre la única vista que arma con su store
 * local. Antes eran dos funciones distintas que tenían que dar el mismo
 * resultado por disciplina.
 *
 * No mira `foregroundRedundancy`: ése es el otro eje y lo evalúa sólo el
 * cliente, porque el servidor no sabe si la app está en primer plano.
 */
const activeViewSuppressesNotification = (view, policy, resourceId, metadata) => {
    const field = policy.redundantWhenViewing;
    if (field === null)
        return false;
    const contextId = (0, resolve_notification_context_id_function_1.resolveNotificationContextId)(policy, resourceId, metadata);
    if (contextId === null)
        return false;
    return view[field] === contextId;
};
exports.activeViewSuppressesNotification = activeViewSuppressesNotification;
