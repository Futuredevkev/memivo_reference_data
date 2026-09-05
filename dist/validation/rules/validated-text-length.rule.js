"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedTextLength = void 0;
/**
 * Cuánto mide un texto PARA EL TOPE, contado exactamente como lo cuenta el que
 * rechaza.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El cliente capaba y contaba con `String.length` —unidades UTF-16— con un
 * docblock que afirmaba, como hecho verificado, que del otro lado
 * `class-validator` mide lo mismo. Es FALSO, y está medido contra el
 * `node_modules` del api: `@MaxLength` no compara `value.length`, hace
 * `isLength(value, { max })`, y `validator@13.15.23` calcula
 *
 *     len = str.length − pares sustitutos − selectores de presentación
 *
 * o sea que RESTA cada emoji de plano astral y cada selector de presentación
 * (`U+FE0F` / `U+FE0E`). Sonda
 * corrida: `maxLength('😀'.repeat(280), 280)` devuelve `true` — el servidor
 * acepta 280 emojis — mientras el campo frenaba en 140 y el contador se pintaba
 * de ROJO diciendo «280/280», que es el estado que significa «ya no entra nada
 * más». La dirección del error era la contraria a la que el docblock temía: no
 * se aceptaba de más y se rechazaba, se frenaba de menos y se mentía.
 *
 * ── POR QUÉ VIVE EN EL PAQUETE Y NO EN EL CLIENTE ─────────────────────────
 * Porque el número tiene que dar IGUAL de los dos lados o no es el mismo tope,
 * y eso es la definición de lo que va en el SSOT. El cliente lo usa para capar
 * y para pintar el contador; el api, donde recorte por su cuenta.
 *
 * ── POR QUÉ REPLICA LA EXPRESIÓN Y NO «CUENTA BIEN» ───────────────────────
 * Porque el objetivo no es contar caracteres «de verdad» —eso serían grafemas, y
 * daría otro número—: es coincidir con el que rechaza, hasta en sus rarezas. Una
 * familia unida por ZWJ mide 5 acá y 5 allá, aunque la persona vea un solo
 * dibujo. El día que `class-validator` cambie de fórmula, esto tiene que cambiar
 * con él, y por eso está escrito como está: para que la comparación sea obvia.
 */
const SELECTORES_DE_PRESENTACION = /[^\uFE0F\uFE0E][\uFE0F\uFE0E]/g;
const PARES_SUSTITUTOS = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const validatedTextLength = (text) => text.length -
    (text.match(SELECTORES_DE_PRESENTACION)?.length ?? 0) -
    (text.match(PARES_SUSTITUTOS)?.length ?? 0);
exports.validatedTextLength = validatedTextLength;
