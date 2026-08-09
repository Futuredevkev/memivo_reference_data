/**
 * De dónde sale, dentro del payload de una push, el id que se compara contra el
 * contexto activo. Antes esto vivía como cadenas de `??` duplicadas en el
 * helper del servidor y en el del cliente, más un catálogo entero
 * (`REACTION_POST_SUPPRESSION_TYPES`) cuya única razón de ser era marcar los
 * dos tipos que leen `metadata.guestPostId` en vez de `resourceId`.
 *
 * Ahora es DATO: cada tipo declara sus fuentes en orden y gana la primera que
 * traiga un string no vacío, así que `metadata.groupId ?? resourceId` se
 * escribe `['metadata.groupId', 'resourceId']` y lo resuelve una sola función
 * (`resolveNotificationContextId`) que corren los dos lados.
 */
export type NotificationContextIdSource = 'resourceId' | 'metadata.albumId' | 'metadata.groupId' | 'metadata.guestPostId' | 'metadata.storyId';
