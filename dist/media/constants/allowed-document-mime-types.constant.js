"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_DOCUMENT_MIME_TYPES = void 0;
const chat_document_kinds_constant_1 = require("./chat-document-kinds.constant");
/**
 * Los MIME de documento que el chat acepta. DERIVADO de `CHAT_DOCUMENT_KINDS`.
 *
 * Lo consumen el selector del teléfono —para que la lista que el usuario ve sea
 * la misma que el servidor admite— y la clasificación del `ResourceType` en el
 * alta del intent. Ninguno de los dos escribe su propia lista: si lo hicieran,
 * la app dejaría elegir formatos que el ingress rechaza, o al revés.
 */
exports.ALLOWED_DOCUMENT_MIME_TYPES = chat_document_kinds_constant_1.CHAT_DOCUMENT_KINDS.map((kind) => kind.mimeType);
