"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_DOCUMENT_FORMATS = void 0;
const chat_document_kinds_constant_1 = require("./chat-document-kinds.constant");
/**
 * Las extensiones de documento que el chat acepta. DERIVADO de
 * `CHAT_DOCUMENT_KINDS`, sin repetidos —dos MIME pueden nombrar la misma.
 *
 * Es lo que viaja en `allowed_formats` de la subida firmada, que es **el único
 * tope que Cloudinary aplica por request** y que participa de su string-to-sign:
 * firmarlo hace que el cliente no lo pueda aflojar y que un formato fuera de
 * lista muera en el ingress antes de guardar un byte.
 *
 * Y es además la lista con la que el cliente decide DÓNDE guardar un archivo
 * que terminó de bajar: la galería del teléfono sólo admite imagen y video, así
 * que un documento va por la hoja de compartir del sistema.
 */
exports.ALLOWED_DOCUMENT_FORMATS = [
    ...new Set(chat_document_kinds_constant_1.CHAT_DOCUMENT_KINDS.flatMap((kind) => kind.extensions)),
];
