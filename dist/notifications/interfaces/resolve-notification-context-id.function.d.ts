import type { NotificationDeliveryPolicy } from './notification-delivery-policy.interface';
/**
 * El id que hay que comparar contra el contexto activo, siguiendo las fuentes
 * que declara la política EN ORDEN: gana la primera que traiga un string no
 * vacío. `null` si el tipo no es contextual o si ninguna fuente resolvió.
 *
 * Los nombres de `NotificationContextIdSource` son las rutas: `'metadata.groupId'`
 * lee `metadata.groupId`. No hay una segunda tabla que mapee nombre → ruta, así
 * que no hay dos cosas que puedan desincronizarse.
 *
 * Esta función la corren los DOS lados. Antes eran dos cadenas de `??`
 * escritas a mano, una en `get-suppression-target.helper` (api) y otra en
 * `notification-foreground.helper` (cliente), que había que mantener idénticas
 * de memoria — y una divergencia ahí no rompe nada visible: simplemente deja de
 * suprimir, o suprime de más, en silencio.
 */
export declare const resolveNotificationContextId: (policy: NotificationDeliveryPolicy, resourceId: unknown, metadata: unknown) => string | null;
