"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENT_CONTEXT_MAX_LIMIT = exports.COMMENT_CONTEXT_MIN_LIMIT = exports.COMMENT_CONTEXT_DEFAULT_LIMIT = void 0;
/**
 * Ventana acotada que usa el deep-link a comentarios. El default coincide con
 * la página normal del cliente; el máximo evita convertir el lookup puntual
 * en otra lectura sin cota.
 */
exports.COMMENT_CONTEXT_DEFAULT_LIMIT = 15;
exports.COMMENT_CONTEXT_MIN_LIMIT = 3;
exports.COMMENT_CONTEXT_MAX_LIMIT = 50;
