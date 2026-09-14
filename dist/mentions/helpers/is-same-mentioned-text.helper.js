"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameMentionedText = void 0;
/**
 * ¿Una edición cambió algo? El mismo texto y las mismas menciones: en el mismo
 * orden, la misma persona en el mismo lugar.
 *
 * ── POR QUÉ VIVE EN EL CONTRATO ──────────────────────────────────────────
 * Lo preguntan las dos puntas y tienen que contestar lo mismo. El servidor no
 * marca «editado» lo que no cambió, y es la autoridad; la app apaga «guardar»
 * sobre un borrador idéntico, para no hacer el viaje. Escrita en cada lado, la
 * definición de «misma edición» podía separarse, y una app que ofrece guardar
 * lo que el servidor no va a marcar —o al revés— se lee como un botón roto.
 * Guardar sin tocar nada marcaba el comentario como editado: MN1 #13, visto en
 * un teléfono el 13 de septiembre de 2026.
 *
 * ── LO QUE NO DECIDE ─────────────────────────────────────────────────────
 * Si las menciones son válidas: eso es `findMentionAnnotationsDefect`. Compara
 * lo que recibe, y el servidor la llama con las menciones YA resueltas, que son
 * las que se van a guardar.
 */
const isSameMentionedText = (a, b) => a.text === b.text &&
    a.mentions.length === b.mentions.length &&
    a.mentions.every((mention, index) => {
        const other = b.mentions[index];
        return (mention.userId === other.userId &&
            mention.start === other.start &&
            mention.length === other.length);
    });
exports.isSameMentionedText = isSameMentionedText;
