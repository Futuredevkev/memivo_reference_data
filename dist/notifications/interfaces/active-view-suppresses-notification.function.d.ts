import type { ActiveView } from '../../sockets';
import type { NotificationDeliveryPolicy } from './notification-delivery-policy.interface';
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
export declare const activeViewSuppressesNotification: (view: ActiveView, policy: NotificationDeliveryPolicy, resourceId: unknown, metadata: unknown) => boolean;
