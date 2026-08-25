"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canEditChatMessage = void 0;
const chat_message_mutation_by_type_constant_1 = require("./chat-message-mutation-by-type.constant");
const enums_1 = require("../enums");
/**
 * LA PUERTA de la edición. Contesta si esta persona puede rehacer este mensaje.
 *
 * Vive del lado del contrato porque las dos puntas tienen que contestar lo
 * mismo por construcción: el servidor la usa como gate del endpoint y la app
 * para decidir si dibuja el botón. Así la app no puede ofrecer algo que el
 * servidor rechace ni quedarse corta frente a lo que sí permite.
 *
 * Un gate que sólo viviera en el servidor dejaba a la app escribiendo su propia
 * condición, y eso ya pasó: la app decidía por «tiene texto no vacío» y ofrecía
 * «Editar mensaje» sobre toda la media con pie, donde el servidor contestaba
 * 400 SIEMPRE. Un botón cuyo único final posible es un toast rojo.
 *
 * ── EL ORDEN DE LOS ESCALONES ES PARTE DEL CONTRATO ────────────────────────
 * Primero la AUTORÍA y después el TIPO, que es el orden en que el servidor los
 * evalúa y por lo tanto el que decide qué error ve la persona cuando fallan los
 * dos a la vez. Invertirlo le contestaría a un extraño que su edición no está
 * soportada, cuando lo que pasa es que el mensaje no es suyo.
 *
 * ── POR QUÉ ACEPTA UN `viewerId` QUE PUEDE NO ESTAR ────────────────────────
 * Porque la app pregunta con la sesión que tiene a mano y esa sesión puede
 * estar cargando. Sin este parámetro tolerante, el call-site tendría que
 * decidir por su cuenta qué hacer con la ausencia — y «no hay sesión» sólo
 * puede significar «no es tu mensaje», que es lo que contesta acá.
 *
 * `scripts/audit-consumers.js` garantiza que api y cliente sigan cruzando esta
 * puerta compartida y no vuelvan a escribir un espejo local.
 */
const canEditChatMessage = (message, viewerId) => {
    if (!viewerId || message.senderId !== viewerId) {
        return { allowed: false, refusal: enums_1.ChatMutationRefusal.NOT_THE_AUTHOR };
    }
    if (chat_message_mutation_by_type_constant_1.CHAT_MESSAGE_MUTATION_BY_TYPE[message.type].edits ===
        enums_1.ChatEditableContent.NONE) {
        return { allowed: false, refusal: enums_1.ChatMutationRefusal.CONTENT_IS_IMMUTABLE };
    }
    return { allowed: true };
};
exports.canEditChatMessage = canEditChatMessage;
