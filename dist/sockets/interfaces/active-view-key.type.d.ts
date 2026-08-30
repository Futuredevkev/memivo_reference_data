import type { ActiveView } from './active-view.interface';
/**
 * Los ejes de contexto disponibles, derivados de `ActiveView` para que no haya
 * dos listas que mantener sincronizadas a mano. Es el vocabulario que usa
 * `NOTIFICATION_DELIVERY_POLICY.redundantWhenViewing`.
 */
export type ActiveViewKey = keyof ActiveView;
