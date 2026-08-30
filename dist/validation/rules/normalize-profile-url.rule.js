"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProfileUrl = void 0;
const http_scheme_regex_constant_1 = require("../patterns/http-scheme-regex.constant");
/**
 * Le pone `https://` adelante a lo que no traiga esquema; el vacío se queda
 * vacío.
 *
 * Vive con las reglas y no adentro del predicado porque tiene un segundo lector
 * legítimo: el formulario, que guarda la forma NORMALIZADA y no la que se
 * tipeó. Si cada uno normalizara por su cuenta, se podría validar una cosa y
 * guardar otra.
 */
const normalizeProfileUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed)
        return '';
    return http_scheme_regex_constant_1.HTTP_SCHEME_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`;
};
exports.normalizeProfileUrl = normalizeProfileUrl;
