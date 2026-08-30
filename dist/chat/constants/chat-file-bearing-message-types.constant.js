"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_FILE_BEARING_MESSAGE_TYPES = void 0;
const chat_message_content_by_type_constant_1 = require("./chat-message-content-by-type.constant");
const enums_1 = require("../enums");
/**
 * Los tipos de mensaje que LLEVAN ARCHIVOS, o sea los que pueden salir del
 * pipeline de subida. DERIVADO del catálogo total.
 *
 * Es la lista que el `@IsIn` del finalize aplica, la que el validador del alta
 * de media exige, y la que el cliente consulta antes de encolar una subida.
 * Estuvo confundida con la de la galería hasta que apareció `DOCUMENT`: una
 * sola lista para las dos preguntas dejaba los documentos sin camino de subida
 * o metía un `.pdf` en la grilla de miniaturas.
 */
exports.CHAT_FILE_BEARING_MESSAGE_TYPES = Object.values(enums_1.ChatMessageType).filter((type) => chat_message_content_by_type_constant_1.CHAT_MESSAGE_CONTENT_BY_TYPE[type].payload === enums_1.ChatContentPayload.FILES);
