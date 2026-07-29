"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTOR_AVATAR_NOTIFICATION_TYPES = void 0;
const enums_1 = require("../enums");
/**
 * Tipos cuyo avatar —en la push Y en la campanita— es el del ACTOR y no el del
 * grupo/álbum guardado en `metadata.avatarUrl`.
 *
 * Vivía escrito a mano en los dos repos, con los comentarios duplicados palabra
 * por palabra, y **ya habían divergido en dos tipos**: el set del servidor
 * incluía `TAGGED_IN_STORY` y `ALBUM_MODERATION_ALERT` y el del cliente no. Un
 * solo set gobierna las dos superficies porque es una sola regla.
 *
 * `CHAT_MEMBER_KICKED` y `ALBUM_ORGANIZER_REMOVED` NO están: son moderación
 * impersonal, así que toman la rama anónima y muestran el avatar del grupo.
 * `NEW_CHAT_MESSAGE` y `CHAT_MESSAGE_REPLY` tampoco: usan el del grupo.
 */
exports.ACTOR_AVATAR_NOTIFICATION_TYPES = new Set([
    enums_1.NotificationType.CHAT_INVITATION,
    enums_1.NotificationType.MEMBER_PROMOTED_ADMIN,
    enums_1.NotificationType.ALBUM_ORGANIZER_PROMOTED,
    enums_1.NotificationType.TAGGED_IN_STORY,
    enums_1.NotificationType.ALBUM_MODERATION_ALERT,
]);
