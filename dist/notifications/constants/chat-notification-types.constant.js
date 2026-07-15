"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_NOTIFICATION_TYPES = void 0;
const enums_1 = require("../enums");
/**
 * Tipos de notificación del módulo Chat/Mensajería. Separan el contador de la
 * campanita (Social) del de la burbuja (Chat). API y cliente deben clasificar
 * IGUAL: la API parte los contadores en SQL y el cliente parte los badges, y
 * ambos dependen del índice parcial de notificaciones en la base.
 */
exports.CHAT_NOTIFICATION_TYPES = [
    enums_1.NotificationType.NEW_CHAT_MESSAGE,
    enums_1.NotificationType.CHAT_MESSAGE_REPLY,
];
