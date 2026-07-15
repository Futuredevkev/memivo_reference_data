"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACTION_POST_SUPPRESSION_TYPES = void 0;
const enums_1 = require("../enums");
/**
 * En reacciones el `resourceId` es el comment/response — el post vive en
 * `metadata.guestPostId` (mismo caso especial del helper de navegación). Este
 * subconjunto marca los tipos de post cuyo id de post NO es el resourceId.
 */
exports.REACTION_POST_SUPPRESSION_TYPES = [
    enums_1.NotificationType.REACTION_COMMENT,
    enums_1.NotificationType.REACTION_RESPONSE,
];
