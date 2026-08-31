"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileReportReason = void 0;
var ProfileReportReason;
(function (ProfileReportReason) {
    ProfileReportReason["HARASSMENT"] = "harassment";
    ProfileReportReason["INAPPROPRIATE_CONTENT"] = "inappropriate_content";
    ProfileReportReason["IMPERSONATION"] = "impersonation";
    ProfileReportReason["SPAM_OR_SCAM"] = "spam_or_scam";
    ProfileReportReason["CHILD_EXPLOITATION"] = "child_exploitation";
    ProfileReportReason["SAFETY_CONCERN"] = "safety_concern";
    /**
     * Reclamo de derechos de autor sobre una pieza publicada.
     *
     * Es la única razón que NACIÓ exigiendo evidencia estructurada: sin la pieza
     * no hay reclamo que se pueda accionar —«tenés algo mío» pide decir *qué*—, y
     * por eso su fila de {@link PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON} es
     * `REQUIRED`. La denuncia sigue siendo contra la PERSONA; la pieza viaja como
     * evidencia de esa denuncia.
     *
     * El camino del titular de derechos que NO es usuario de Memivo no es éste:
     * es el correo publicado en los términos §10.1, que termina en el mismo
     * expediente por la vía de administración.
     */
    ProfileReportReason["COPYRIGHT"] = "copyright";
    ProfileReportReason["OTHER"] = "other";
})(ProfileReportReason || (exports.ProfileReportReason = ProfileReportReason = {}));
