"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileReportStatus = void 0;
/**
 * Estado de un reporte de perfil. Viaja por el cable en la superficie de
 * moderación, así que su fuente de verdad es el paquete y no el servidor.
 */
var ProfileReportStatus;
(function (ProfileReportStatus) {
    ProfileReportStatus["OPEN"] = "open";
    ProfileReportStatus["REVIEWED"] = "reviewed";
    ProfileReportStatus["DISMISSED"] = "dismissed";
})(ProfileReportStatus || (exports.ProfileReportStatus = ProfileReportStatus = {}));
