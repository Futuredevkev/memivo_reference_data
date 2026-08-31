"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON = void 0;
const enums_1 = require("../enums");
/**
 * EL DUEÑO de «¿esta razón de denuncia señala una pieza de contenido?», y es
 * uno solo para los dos lados del cable.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * La denuncia de perfil pasó a poder llevar un puntero a contenido, como
 * EVIDENCIA de lo que se le imputa a la persona. Esa pregunta se contesta en
 * dos lugares por fuerza —el cliente decide si muestra el paso, el servidor
 * decide si acepta el cuerpo— y si cada uno la contestara por su cuenta se
 * desincronizan: el cliente esconde el paso de una razón que el servidor exige
 * y la denuncia se vuelve imposible de mandar, o el cliente lo muestra donde el
 * servidor lo rechaza y el usuario pierde lo que escribió. Es ORDEN §1 con dos
 * repos de por medio, así que la tabla vive acá y los dos la IMPORTAN.
 *
 * ── POR QUÉ UN `Record` TOTAL Y NO UNA LISTA ───────────────────────────────
 * Una lista de «razones que piden pieza» no tiene gate: la razón siguiente
 * entra en silencio heredando el comportamiento de estar afuera de la lista,
 * que es justo la decisión que hay que tomar a conciencia. Con el `Record`
 * total, un miembro nuevo de {@link ProfileReportReason} **no compila** hasta
 * que alguien conteste esta pregunta (ORDEN §6).
 *
 * Y no puede ser `Partial`: un opcional no obliga a nada — la razón sin fila no
 * falla ruidosa, cae a un genérico y se cuela.
 *
 * ── EL CRITERIO, PARA LA PRÓXIMA RAZÓN ─────────────────────────────────────
 * *¿Bajar esa pieza resuelve el reclamo, o el sujeto es la conducta?* Si sin la
 * pieza el reclamo no se puede accionar, `REQUIRED`. Si la pieza es un ejemplo
 * útil de un patrón que igual es de la persona, `OPTIONAL`. Si el sujeto es la
 * conducta o la cuenta entera, `FORBIDDEN` — y ahí pedir la pieza miente sobre
 * lo que va a pasar después.
 *
 * ── LO QUE ESTA TABLA NO DECIDE ────────────────────────────────────────────
 * Qué se hace con la pieza señalada. Que exista un puntero no promete removerla:
 * la remoción es una acción de plataforma con su propio expediente, y se toma a
 * mano. La denuncia sigue siendo contra la PERSONA en las ocho filas.
 */
exports.PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON = {
    // Sin la pieza no hay reclamo: «tenés algo mío» exige decir qué.
    [enums_1.ProfileReportReason.COPYRIGHT]: enums_1.ProfileReportContentRequirement.REQUIRED,
    // Es lo único que la plataforma tiene que poder bajar YA, y no se puede bajar
    // lo que no se nombró.
    [enums_1.ProfileReportReason.CHILD_EXPLOITATION]: enums_1.ProfileReportContentRequirement.REQUIRED,
    // Desnudos o violencia: señalar la pieza ayuda a revisar, pero el patrón que
    // se sanciona es de la persona, así que no se exige.
    [enums_1.ProfileReportReason.INAPPROPRIATE_CONTENT]: enums_1.ProfileReportContentRequirement.OPTIONAL,
    // Puede ser una amenaza concreta —que conviene poder mirar— o una conducta
    // sostenida que no vive en ninguna pieza.
    [enums_1.ProfileReportReason.SAFETY_CONCERN]: enums_1.ProfileReportContentRequirement.OPTIONAL,
    // El acoso es un patrón, no un mensaje. Bajar uno no arregla nada, y pedirlo
    // haría creer que sí.
    [enums_1.ProfileReportReason.HARASSMENT]: enums_1.ProfileReportContentRequirement.FORBIDDEN,
    // El sujeto es la cuenta entera: la infracción es hacerse pasar por alguien,
    // no ninguna publicación en particular.
    [enums_1.ProfileReportReason.IMPERSONATION]: enums_1.ProfileReportContentRequirement.FORBIDDEN,
    // Ídem: se sanciona a quien lo hace, y bajar un posteo deja al que lo publica.
    [enums_1.ProfileReportReason.SPAM_OR_SCAM]: enums_1.ProfileReportContentRequirement.FORBIDDEN,
    // Sin forma conocida no se puede pedir evidencia estructurada; lo que haya se
    // cuenta en la descripción.
    [enums_1.ProfileReportReason.OTHER]: enums_1.ProfileReportContentRequirement.FORBIDDEN,
};
