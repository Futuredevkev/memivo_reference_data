import type { ActiveViewKey } from '../../sockets';

import type { NotificationContextIdSource } from './notification-context-id-source.type';
import type { NotificationForegroundRedundancy } from './notification-foreground-redundancy.type';
import type { NotificationInAppSurface } from './notification-in-app-surface.type';

/**
 * Qué hace un tipo de notificación cuando la app está viva. Una fila por tipo
 * en `NOTIFICATION_DELIVERY_POLICY`, y de esa tabla se derivan TODAS las
 * decisiones de supresión de los dos lados del cable.
 *
 * Los dos ejes son ORTOGONALES y los evalúan consumidores distintos:
 *
 * - `redundantWhenViewing` lo miran los DOS. El servidor conoce la pantalla
 *   abierta por la presencia que el socket reporta (`viewsSuppressNotification`)
 *   y el cliente la conoce de primera mano (`shouldSuppressForegroundNotification`).
 * - `foregroundRedundancy` lo mira SÓLO el cliente: el servidor no tiene forma
 *   de saber si la app está en primer plano.
 *
 * Un tipo puede declarar los dos, uno, o ninguno.
 */
export interface NotificationDeliveryPolicy {
  /**
   * Qué eje de contexto abierto la vuelve redundante, o `null` si no depende de
   * ninguna pantalla.
   */
  readonly redundantWhenViewing: ActiveViewKey | null;
  /**
   * Fuentes del id a comparar contra ese eje, EN ORDEN: gana la primera que
   * traiga un string no vacío. Vacío si y sólo si `redundantWhenViewing` es
   * `null`.
   */
  readonly contextIdSources: readonly NotificationContextIdSource[];
  /** Por qué sobra con la app abierta, sin mirar la pantalla. */
  readonly foregroundRedundancy: NotificationForegroundRedundancy;
  /**
   * Si deja fila revisitable en la campanita. `false` = push-only
   * (`pushOnlyTo*`): suprimirla es perder el evento para siempre, y por eso
   * pesa tanto al decidir el resto de la fila.
   *
   * También es lo que habilita el eje «estoy parado en la campanita», que es
   * puramente del cliente: sólo tiene sentido callar el banner del sistema
   * operativo cuando la fila ya está entrando sola en la lista que el usuario
   * está mirando.
   */
  readonly persistsBellRow: boolean;
  /**
   * Qué superficie in-app dice lo mismo que la push. Obligatoria cuando se
   * suprime algo; `null` sólo cuando no se suprime nada, o cuando la supresión
   * es `re-engagement` (donde no hay información que sustituir).
   */
  readonly replacedBy: NotificationInAppSurface | null;
}
