"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentionTextOf = void 0;
/**
 * El trozo del texto que una anotación señala, `@` incluido.
 *
 * ── POR QUÉ UNA FUNCIÓN PARA UN `slice` ───────────────────────────────────
 * Porque es el ÚNICO lugar donde un offset de mención se convierte en texto, y
 * ésa es la operación que se escribe mal: con `substring` en vez de `slice`,
 * con `start + length - 1`, o contando «caracteres» en vez de unidades UTF-16.
 * La invariante (`mentionMatchesText`), la edición del servidor —que acepta una
 * mención que ya estaba guardada con el mismo texto— y el dibujo de la app la
 * necesitan igual. Hay un gate en cada consumidor que prohíbe recortar por
 * offsets de mención fuera de esta función.
 */
const mentionTextOf = (text, annotation) => text.slice(annotation.start, annotation.start + annotation.length);
exports.mentionTextOf = mentionTextOf;
