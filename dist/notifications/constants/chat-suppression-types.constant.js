"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_SUPPRESSION_TYPES = void 0;
const enums_1 = require("../enums");
/**
 * Catálogos de supresión de push por "contexto ya en pantalla". Si el usuario
 * está viendo el chat/post/story al que apunta la notificación, es redundante:
 * la API saltea el push (`viewsSuppressNotification`) y el cliente suprime el
 * banner en foreground (`shouldSuppressForegroundNotification`). AMBOS lados
 * deben decidir sobre el MISMO conjunto de tipos; agregar un tipo suprimible en
 * un solo lado rompe el contrato en silencio. Cada consumidor envuelve estos
 * arrays en un `Set` local para el test de pertenencia.
 */
exports.CHAT_SUPPRESSION_TYPES = [
    enums_1.NotificationType.NEW_CHAT_MESSAGE,
    enums_1.NotificationType.CHAT_MESSAGE_REPLY,
    enums_1.NotificationType.CHAT_MESSAGE_REACTION,
    enums_1.NotificationType.POLL_CREATED,
];
