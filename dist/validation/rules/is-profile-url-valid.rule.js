"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProfileUrlValid = void 0;
const http_scheme_regex_constant_1 = require("../patterns/http-scheme-regex.constant");
const fqdn_host_regex_constant_1 = require("../patterns/fqdn-host-regex.constant");
const limits_1 = require("../limits");
const normalize_profile_url_rule_1 = require("./normalize-profile-url.rule");
/**
 * Cualquier prefijo `esquema://` explícito (ftp://, file://, ws://, …). Sirve
 * para rechazar un esquema que no es http(s) ANTES de que la normalización lo
 * tape agregándole `https://` adelante.
 */
const URL_SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
/**
 * ¿ES UNA URL DE PERFIL VÁLIDA? La misma respuesta para las dos puntas.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Esta regla estaba escrita dos veces y no decían lo mismo. El cliente parseaba
 * con `new URL` y sólo miraba el protocolo; el servidor usaba `@IsUrl`, que
 * exige TLD por defecto. Así, `juanperez` pasaba el gate del formulario —el
 * `URL` de la especificación admite hosts de una sola etiqueta— y el 400 llegaba
 * después de mandar. El más permisivo era justamente el que la persona veía.
 *
 * ── EL VACÍO ES VÁLIDO, Y ES DELIBERADO ───────────────────────────────────
 * Todos los campos que usan esta regla son OPCIONALES. Quien necesite que además
 * esté presente lo combina con su propio chequeo de requerido; meterlo acá
 * obligaría a cada campo opcional a rodear la regla, que es como se termina
 * teniendo dos.
 */
const isProfileUrlValid = (value) => {
    const trimmed = value.trim();
    if (!trimmed)
        return true;
    if (URL_SCHEME_REGEX.test(trimmed) && !http_scheme_regex_constant_1.HTTP_SCHEME_REGEX.test(trimmed)) {
        return false;
    }
    const normalized = (0, normalize_profile_url_rule_1.normalizeProfileUrl)(trimmed);
    if (normalized.length > limits_1.PROFILE_URL_MAX)
        return false;
    try {
        const parsed = new URL(normalized);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }
        return fqdn_host_regex_constant_1.FQDN_HOST_REGEX.test(parsed.hostname);
    }
    catch {
        return false;
    }
};
exports.isProfileUrlValid = isProfileUrlValid;
