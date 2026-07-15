import { NotificationType } from '../enums';
/**
 * En reacciones el `resourceId` es el comment/response — el post vive en
 * `metadata.guestPostId` (mismo caso especial del helper de navegación). Este
 * subconjunto marca los tipos de post cuyo id de post NO es el resourceId.
 */
export declare const REACTION_POST_SUPPRESSION_TYPES: readonly [NotificationType.REACTION_COMMENT, NotificationType.REACTION_RESPONSE];
