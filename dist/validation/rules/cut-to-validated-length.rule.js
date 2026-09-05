"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutToValidatedLength = void 0;
const validated_text_length_rule_1 = require("./validated-text-length.rule");
/**
 * Corta un texto al largo que el servidor acepta, contando como él cuenta y sin
 * partir un carácter por la mitad.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El cortador vivía en el cliente y cortaba por unidades UTF-16, apoyado en un
 * docblock que afirmaba que del otro lado se cuenta igual. No se cuenta igual
 * (ver [validatedTextLength]): con emoji el campo frenaba en la MITAD del tope y
 * el contador se pintaba de rojo con «280/280» cuando el servidor habría
 * aceptado 280 emojis de verdad.
 *
 * Vive acá y no en el cliente porque el corte y el rechazo tienen que usar el
 * MISMO número: son las dos puntas del mismo tope.
 *
 * ── POR QUÉ NO ES UN `slice` ──────────────────────────────────────────────
 * Porque un emoji ocupa dos unidades y cortar en seco deja media pareja suelta:
 * un carácter que no existe, que se dibuja como un rombo con signo de pregunta y
 * que viaja así al servidor. El nativo de iOS ya hacía esta cuenta adentro de su
 * `maxLength` (`rangeOfComposedCharacterSequenceAtIndex`); al sacarle el tope al
 * nativo para poder ENTERARSE del corte, esa defensa se vino con él.
 *
 * ── LO QUE NO HACE, DICHO ─────────────────────────────────────────────────
 * No respeta secuencias de varios puntos de código —una familia unida por ZWJ,
 * una bandera, un emoji con tono de piel— y no puede: el servidor tampoco las
 * respeta, así que cortar por grafemas dejaría al campo frenando antes de lo que
 * el servidor acepta, que es un tope distinto del declarado. Lo que se defiende
 * es el caso que produce un carácter INVÁLIDO, no el que produce uno feo. Lo
 * único que cambió respecto de la versión anterior es CUÁNTO entra, no dónde se
 * puede cortar.
 */
const cutToValidatedLength = (text, max) => {
    if (max <= 0)
        return '';
    if ((0, validated_text_length_rule_1.validatedTextLength)(text) <= max)
        return text;
    const esSelector = (unidad) => unidad === 0xfe0f || unidad === 0xfe0e;
    let indice = 0;
    let contadas = 0;
    while (indice < text.length && contadas < max) {
        const unidad = text.charCodeAt(indice);
        const siguiente = text.charCodeAt(indice + 1);
        const esPar = unidad >= 0xd800 &&
            unidad <= 0xdbff &&
            siguiente >= 0xdc00 &&
            siguiente <= 0xdfff;
        // El ancho en UNIDADES de lo que cuenta como uno: un par sustituto son dos.
        let ancho = esPar ? 2 : 1;
        // Un selector de presentación que sigue a algo que no es un selector viaja
        // pegado y NO suma — es exactamente el par que `validator` descuenta, y su
        // regex empareja sobre unidades, así que lo que tiene que no ser selector es
        // la ÚLTIMA unidad de lo que acabamos de contar, no el punto de código.
        const ultima = text.charCodeAt(indice + ancho - 1);
        if (!esSelector(ultima) && esSelector(text.charCodeAt(indice + ancho))) {
            ancho += 1;
        }
        indice += ancho;
        contadas += 1;
    }
    return text.slice(0, indice);
};
exports.cutToValidatedLength = cutToValidatedLength;
