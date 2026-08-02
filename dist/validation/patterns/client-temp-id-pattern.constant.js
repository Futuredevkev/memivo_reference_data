"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_TEMP_ID_PATTERN = void 0;
/**
 * El cliente genera el `clientTempId` localmente (ej. `upload_<ts>_<rand>`
 * para el background upload, o el id de retry del chat); por eso NO es un
 * UUID. Acotado a un allowlist de caracteres seguros para que sirva como
 * clave de idempotencia/correlación sin abrir la puerta a inyección.
 *
 * Mismo motivo que `CLIENT_TEMP_ID_MAX_LENGTH` (ficha #111): vivía
 * redeclarado local en el decorador `@IsClientTempId` del api sin que el
 * cliente compartiera la regla exacta que el servidor iba a exigir.
 */
exports.CLIENT_TEMP_ID_PATTERN = /^[A-Za-z0-9:_-]+$/;
