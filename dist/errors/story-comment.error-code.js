"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryCommentErrorCode = void 0;
var StoryCommentErrorCode;
(function (StoryCommentErrorCode) {
    StoryCommentErrorCode["STORY_COMMENT_NOT_FOUND"] = "STORY_COMMENT_NOT_FOUND";
    StoryCommentErrorCode["STORY_COMMENT_FORBIDDEN"] = "STORY_COMMENT_FORBIDDEN";
    StoryCommentErrorCode["STORY_EXPIRED"] = "STORY_EXPIRED";
    // ── LA OPERACIÓN QUE PIDIÓ LA PERSONA FALLÓ POR ALGO INESPERADO ──────────
    // Status 500 y sufijo `_FAILED`. Cada código nombra la operación del BORDE
    // —lo que la persona pidió—, no un paso de adentro. Antes caían en
    // `INTERNAL_SERVER_ERROR` y la app decía «Error interno del servidor» en vez
    // de qué fue lo que no se pudo hacer.
    StoryCommentErrorCode["STORY_COMMENT_CREATE_FAILED"] = "STORY_COMMENT_CREATE_FAILED";
    StoryCommentErrorCode["STORY_COMMENT_UPDATE_FAILED"] = "STORY_COMMENT_UPDATE_FAILED";
    StoryCommentErrorCode["STORY_COMMENT_DELETE_FAILED"] = "STORY_COMMENT_DELETE_FAILED";
})(StoryCommentErrorCode || (exports.StoryCommentErrorCode = StoryCommentErrorCode = {}));
