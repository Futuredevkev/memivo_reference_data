"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStickerQuery = void 0;
const rules_1 = require("../../validation/rules");
const constants_1 = require("../constants");
/**
 * EL DUEÑO de la identidad de un término del catálogo.
 *
 * La app usa el término como clave local y el servidor como clave compartida.
 * Con sólo `trim`, cambiar mayúsculas o repetir un espacio abría dos entradas en
 * el teléfono para una sola entrada del servidor: la grilla se vaciaba y volvía
 * a pedir un resultado que ya tenía. Compartir la función impide que esas dos
 * definiciones vuelvan a divergir.
 *
 * Baja a minúsculas SIN depender del locale del dispositivo, recorta los
 * bordes, colapsa el espacio interno y aplica el mismo tope que el borde. Usar
 * el locale implícito permitiría que el mismo texto tuviera otra clave en un
 * teléfono y en el servidor. No elimina acentos: cambiar letras cambia la
 * búsqueda que la persona hizo.
 *
 * ── POR QUÉ EL TOPE NO ES UN `slice` ──────────────────────────────────────
 * Porque «el mismo tope que el borde» es una afirmación, y con `slice` era
 * falsa: el borde es `@MaxLength`, que cuenta como cuenta `validator` —restando
 * pares sustitutos y selectores de presentación— y un `slice` cuenta unidades
 * UTF-16. Una búsqueda con emoji se recortaba a la MITAD de lo que el servidor
 * acepta, y peor: podía partir un par sustituto por la mitad y dejar media
 * pareja adentro de una CLAVE de caché, o sea un carácter que no existe
 * viajando como identidad. Ver [cutToValidatedLength].
 */
const normalizeStickerQuery = (query) => (0, rules_1.cutToValidatedLength)(query.toLowerCase().trim().replace(/\s+/g, ' '), constants_1.STICKER_QUERY_MAX_LENGTH);
exports.normalizeStickerQuery = normalizeStickerQuery;
