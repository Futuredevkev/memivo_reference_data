"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFESSIONAL_VIDEO_MAX_DURATION_MS = void 0;
const enums_1 = require("../enums");
const resource_upload_limits_constant_1 = require("./resource-upload-limits.constant");
/**
 * El tope de duración del video profesional en MILISEGUNDOS, derivado de su
 * fila del catálogo.
 *
 * Existe por lo mismo que sus tres hermanos: el preset del cliente y el recorte
 * nativo trabajan en milisegundos y el catálogo publica segundos. Derivarlo
 * —en vez de escribir el número otra vez— es lo que impide que el recorte del
 * teléfono y el rechazo del servidor hablen de plazos distintos.
 */
exports.PROFESSIONAL_VIDEO_MAX_DURATION_MS = resource_upload_limits_constant_1.RESOURCE_UPLOAD_LIMITS[enums_1.ResourceType.PROFESSIONAL_VIDEO].maxDurationSeconds *
    1000;
