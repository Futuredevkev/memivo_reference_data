export declare enum ProfileReportReason {
    HARASSMENT = "harassment",
    INAPPROPRIATE_CONTENT = "inappropriate_content",
    IMPERSONATION = "impersonation",
    SPAM_OR_SCAM = "spam_or_scam",
    CHILD_EXPLOITATION = "child_exploitation",
    SAFETY_CONCERN = "safety_concern",
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
    COPYRIGHT = "copyright",
    OTHER = "other"
}
