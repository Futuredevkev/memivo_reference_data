/**
 * El piso de la ventana del deep-link a comentarios.
 *
 * Con un tope menor la ventana deja de contener al comentario apuntado más su
 * contexto inmediato, que es lo único que el deep-link existe para mostrar: el
 * lector aterriza sin nada alrededor y no entiende de qué se hablaba.
 */
export declare const COMMENT_CONTEXT_MIN_LIMIT = 3;
