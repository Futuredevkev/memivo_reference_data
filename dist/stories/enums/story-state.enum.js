"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryState = void 0;
/**
 * Estado de una historia. NO es una columna: se deriva de `expiresAt` contra el
 * reloj, así que la partición es total y no existe ventana intermedia.
 */
var StoryState;
(function (StoryState) {
    StoryState["ACTIVE"] = "ACTIVE";
    StoryState["ARCHIVED"] = "ARCHIVED";
})(StoryState || (exports.StoryState = StoryState = {}));
