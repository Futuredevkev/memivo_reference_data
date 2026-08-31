/**
 * Qué hace una razón de denuncia con la pieza de contenido que la origina.
 *
 * ── POR QUÉ ES UN EJE PROPIO Y NO UN BOOLEANO ──────────────────────────────
 * Son TRES estados y no dos, y el del medio es el que se pierde con un
 * booleano: hay razones donde señalar la pieza AYUDA pero el patrón sigue
 * siendo de la persona (contenido inapropiado, seguridad). Colapsarlas contra
 * `REQUIRED` bloquearía denuncias legítimas de quien no tiene una pieza a mano;
 * colapsarlas contra `FORBIDDEN` tiraría la evidencia que el denunciante sí
 * tenía.
 *
 * `FORBIDDEN` no es «no hace falta»: es que la pieza NO ES el sujeto y pedirla
 * desorienta. El acoso es una conducta sostenida —bajar un mensaje no lo
 * arregla—, la suplantación es la cuenta entera, y el spam se resuelve sobre
 * quien lo hace. Aceptar un puntero ahí crearía la expectativa de que bajar esa
 * pieza cierra el caso, y no lo cierra.
 */
export declare enum ProfileReportContentRequirement {
    REQUIRED = "REQUIRED",
    OPTIONAL = "OPTIONAL",
    FORBIDDEN = "FORBIDDEN"
}
