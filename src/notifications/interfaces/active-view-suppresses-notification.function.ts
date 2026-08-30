import type { ActiveView } from '../../sockets';

import type { NotificationDeliveryPolicy } from './notification-delivery-policy.interface';
import { resolveNotificationContextId } from './resolve-notification-context-id.function';

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
export const activeViewSuppressesNotification = (
  view: ActiveView,
  policy: NotificationDeliveryPolicy,
  resourceId: unknown,
  metadata: unknown,
): boolean => {
  const field = policy.redundantWhenViewing;
  if (field === null) return false;

  const contextId = resolveNotificationContextId(policy, resourceId, metadata);
  if (contextId === null) return false;

  return view[field] === contextId;
};
