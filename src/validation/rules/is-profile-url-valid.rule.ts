import { HTTP_SCHEME_REGEX } from '../patterns/http-scheme-regex.constant';
import { FQDN_HOST_REGEX } from '../patterns/fqdn-host-regex.constant';
import { PROFILE_URL_MAX } from '../limits';
import { normalizeProfileUrl } from './normalize-profile-url.rule';

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
export const isProfileUrlValid = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  if (URL_SCHEME_REGEX.test(trimmed) && !HTTP_SCHEME_REGEX.test(trimmed)) {
    return false;
  }

  const normalized = normalizeProfileUrl(trimmed);
  if (normalized.length > PROFILE_URL_MAX) return false;

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    return FQDN_HOST_REGEX.test(parsed.hostname);
  } catch {
    return false;
  }
};
