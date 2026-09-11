"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMentionAnnotationsDefect = void 0;
const mentions_max_items_constant_1 = require("../../validation/limits/mentions-max-items.constant");
const constants_1 = require("../constants");
/**
 * LA FORMA de una lista de menciones, sin mirar a nadie: devuelve la PRIMERA
 * causa por la que no se puede guardar, o `null` si está bien formada.
 *
 * ── POR QUÉ VIVE EN EL CONTRATO ───────────────────────────────────────────
 * Porque las dos puntas la necesitan y tienen que contestar lo mismo: el
 * servidor la usa como primer escalón del validador de la escritura, y la app
 * no manda nunca una lista que el servidor vaya a rechazar por forma. Escrita a
 * mano en cada lado, la regla del solapamiento —la más fácil de escribir con un
 * off-by-one— daría dos respuestas.
 *
 * ── EL ORDEN DE LAS PREGUNTAS ─────────────────────────────────────────────
 * El tope va PRIMERO a propósito: es la única causa que una persona puede
 * resolver sola (sacando menciones), así que si hay varias es la que conviene
 * decirle. El resto sólo lo produce un cuerpo armado a mano.
 *
 * ── LO QUE NO DECIDE ───────────────────────────────────────────────────────
 * Si el nombre escrito es el de esa persona (`mentionMatchesText`), ni si la
 * persona puede leer el texto — la audiencia la conoce el servidor. Y una misma
 * persona mencionada dos veces NO es un defecto: es cómo escribe la gente, y
 * el aviso sale una sola vez igual porque los destinatarios son un conjunto.
 */
const findMentionAnnotationsDefect = (text, annotations) => {
    if (annotations.length > mentions_max_items_constant_1.MENTIONS_MAX_ITEMS)
        return 'too-many';
    let previousEnd = 0;
    for (const { start, length } of annotations) {
        if (!Number.isSafeInteger(start) ||
            !Number.isSafeInteger(length) ||
            start < 0 ||
            length < constants_1.MENTION_TRIGGER.length + 1) {
            return 'malformed';
        }
        if (start + length > text.length)
            return 'out-of-bounds';
        if (!text.startsWith(constants_1.MENTION_TRIGGER, start))
            return 'not-on-trigger';
        if (start < previousEnd)
            return 'unordered-or-overlapping';
        previousEnd = start + length;
    }
    return null;
};
exports.findMentionAnnotationsDefect = findMentionAnnotationsDefect;
