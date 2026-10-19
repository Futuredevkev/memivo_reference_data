/**
 * Códigos de error del módulo de comentarios y respuestas
 */
export enum CommentErrorCode {
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  COMMENT_FORBIDDEN = 'COMMENT_FORBIDDEN',
  RESPONSE_NOT_FOUND = 'RESPONSE_NOT_FOUND',
  RESPONSE_FORBIDDEN = 'RESPONSE_FORBIDDEN',

  // ── LA OPERACIÓN QUE PIDIÓ LA PERSONA FALLÓ POR ALGO INESPERADO ──────────
  // Status 500 y sufijo `_FAILED`. Cada código nombra la operación del BORDE
  // —lo que la persona pidió—, no un paso de adentro. Antes caían en
  // `INTERNAL_SERVER_ERROR` y la app decía «Error interno del servidor» en vez
  // de qué fue lo que no se pudo hacer.
  COMMENT_CREATE_FAILED = 'COMMENT_CREATE_FAILED',
  COMMENT_UPDATE_FAILED = 'COMMENT_UPDATE_FAILED',
  COMMENT_DELETE_FAILED = 'COMMENT_DELETE_FAILED',
  RESPONSE_CREATE_FAILED = 'RESPONSE_CREATE_FAILED',
  RESPONSE_UPDATE_FAILED = 'RESPONSE_UPDATE_FAILED',
  RESPONSE_DELETE_FAILED = 'RESPONSE_DELETE_FAILED',
}
