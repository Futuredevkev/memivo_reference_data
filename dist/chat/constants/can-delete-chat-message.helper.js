"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canDeleteChatMessage = void 0;
const chat_message_mutation_by_type_constant_1 = require("./chat-message-mutation-by-type.constant");
const enums_1 = require("../enums");
/**
 * LA PUERTA del borrado. Contesta si esta persona puede sacar este mensaje de
 * su chat.
 *
 * Vive al lado de la puerta de edición y por el mismo motivo: las dos puntas
 * cruzan esta función —`validateDeletePermissions` en el api y
 * `useChatMessageActions` en el cliente—, por lo que la jerarquía no queda
 * repetida a mano ni puede divergir en silencio.
 *
 * ── EL TIPO SE MIRA ANTES QUE LA AUTORIDAD ────────────────────────────────
 * Y no es cosmético: hay mensajes que no borra NADIE, ni el creador del grupo.
 * Poner la autoridad primero haría que el escalón de tipo quedara escondido
 * detrás de un permiso, o sea que el más poderoso de la sala sería el único que
 * podría toparse con él.
 *
 * ── LA JERARQUÍA, DE ARRIBA HACIA ABAJO ───────────────────────────────────
 * El autor siempre borra lo suyo; el creador del grupo borra cualquier cosa; un
 * admin borra lo de los demás pero NO lo del creador. Ese último escalón es la
 * razón de que la jerarquía no se pueda expresar con un booleano «puede
 * moderar»: depende de quién escribió el mensaje, no sólo de quién mira.
 *
 * `scripts/audit-consumers.js` garantiza que ambos consumidores sigan usando
 * esta puerta y no reintroduzcan una política paralela.
 */
const canDeleteChatMessage = (message, viewer) => {
    if (!chat_message_mutation_by_type_constant_1.CHAT_MESSAGE_MUTATION_BY_TYPE[message.type].deletable) {
        return { allowed: false, refusal: enums_1.ChatMutationRefusal.MESSAGE_IS_IMMUTABLE };
    }
    const isAuthor = message.senderId !== null && message.senderId === viewer.userId;
    const isGroupCreator = !!viewer.groupCreatorId && viewer.groupCreatorId === viewer.userId;
    const isAdmin = viewer.role === enums_1.ChatMemberRole.ADMIN;
    const authorIsGroupCreator = !!viewer.groupCreatorId && message.senderId === viewer.groupCreatorId;
    if (isAuthor || isGroupCreator || (isAdmin && !authorIsGroupCreator)) {
        return { allowed: true };
    }
    return { allowed: false, refusal: enums_1.ChatMutationRefusal.NOT_AUTHORIZED };
};
exports.canDeleteChatMessage = canDeleteChatMessage;
