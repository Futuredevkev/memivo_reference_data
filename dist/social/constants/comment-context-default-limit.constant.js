"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENT_CONTEXT_DEFAULT_LIMIT = void 0;
/**
 * Cuántos comentarios trae la ventana del deep-link cuando el pedido no dice
 * un tamaño.
 *
 * Coincide con la página normal del cliente a propósito: si el deep-link
 * abriera con otra cantidad, el primer scroll pediría un tramo solapado o
 * salteado, y quien llega por link vería una lista distinta de la que ve quien
 * llega por la app.
 */
exports.COMMENT_CONTEXT_DEFAULT_LIMIT = 15;
