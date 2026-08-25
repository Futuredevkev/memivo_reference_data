/**
 * Cuántos comentarios trae la ventana del deep-link cuando el pedido no dice
 * un tamaño.
 *
 * Coincide con la página normal del cliente a propósito: si el deep-link
 * abriera con otra cantidad, el primer scroll pediría un tramo solapado o
 * salteado, y quien llega por link vería una lista distinta de la que ve quien
 * llega por la app.
 */
export const COMMENT_CONTEXT_DEFAULT_LIMIT = 15;
