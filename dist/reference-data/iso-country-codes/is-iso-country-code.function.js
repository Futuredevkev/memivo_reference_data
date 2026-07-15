"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIsoCountryCode = void 0;
const iso_country_code_set_constant_1 = require("./internal/iso-country-code-set.constant");
const isIsoCountryCode = (value) => iso_country_code_set_constant_1.ISO_COUNTRY_CODE_SET.has(value);
exports.isIsoCountryCode = isIsoCountryCode;
