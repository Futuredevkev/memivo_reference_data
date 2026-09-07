"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFESSIONAL_VIDEO_MAX_FILE_SIZE_BYTES = void 0;
const enums_1 = require("../enums");
const resource_upload_limits_constant_1 = require("./resource-upload-limits.constant");
/**
 * El tope de peso del video profesional, derivado de su fila del catálogo.
 *
 * Lo lee el preset del cliente, que es quien decide si el archivo elegido hay
 * que recomprimirlo antes de subir. Sin derivarlo, el teléfono podría comprimir
 * contra un techo distinto del que el servidor rechaza, y la persona esperaría
 * la compresión entera para recibir un 400.
 */
exports.PROFESSIONAL_VIDEO_MAX_FILE_SIZE_BYTES = resource_upload_limits_constant_1.RESOURCE_UPLOAD_LIMITS[enums_1.ResourceType.PROFESSIONAL_VIDEO].maxFileSize;
