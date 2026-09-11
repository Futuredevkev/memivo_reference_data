"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentionMatchesText = void 0;
const helpers_1 = require("../../common/helpers");
const constants_1 = require("../constants");
/**
 * LA INVARIANTE de una mención: el trozo del texto que la anotación señala dice
 * exactamente `@` + el nombre visible de la persona.
 *
 * ── POR QUÉ RECIBE LA PERSONA Y NO UN NOMBRE YA ARMADO ────────────────────
 * Porque el dueño único de la validez no puede recibir de afuera la mitad
 * peligrosa. Con un `displayName: string` de parámetro, cada llamador arma el
 * nombre con su propia derivación, y eran dos que no daban igual (ver
 * `formatPersonDisplayName`). Recibiendo `{ name, lastName }` la derivación
 * queda adentro y las dos puntas no pueden contestar distinto.
 *
 * ── LO QUE NO DECIDE ───────────────────────────────────────────────────────
 * Que la anotación esté bien FORMADA (enteros, dentro del texto, ordenadas, sin
 * solaparse, dentro del tope): eso es `findMentionAnnotationsDefect`, que no
 * necesita a la persona. Y tampoco decide si la persona puede leer el texto:
 * la audiencia es del servidor, que es el único que la conoce.
 */
const mentionMatchesText = (text, annotation, person) => text.slice(annotation.start, annotation.start + annotation.length) ===
    constants_1.MENTION_TRIGGER + (0, helpers_1.formatPersonDisplayName)(person);
exports.mentionMatchesText = mentionMatchesText;
