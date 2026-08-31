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
    // ⚠️ DECISIÓN PROVISORIA (31 ago 2026) — bajada de REQUIRED a OPTIONAL, y el
    // motivo NO es de producto sino de los binarios que ya están instalados.
    //
    // El diseño de la ola la puso obligatoria con un argumento correcto: es lo
    // único que la plataforma tiene que poder bajar YA, y no se puede bajar lo que
    // no se nombró. Ese argumento sigue valiendo. Lo que no contemplaba es que la
    // app NO se actualiza sola y que los dos campos del puntero nacieron en la
    // v15.0.0: todo teléfono con la versión anterior ofrece esta razón y arma un
    // cuerpo SIN pieza, así que con `REQUIRED` el servidor le contesta 400 y la
    // denuncia no se crea. Medido: es la ÚNICA razón que rompe al binario viejo
    // —las tres `FORBIDDEN` nunca mandan pieza, y `COPYRIGHT` es nueva y el
    // binario viejo no la ofrece—, y encima el `errorCode` no existe en su locale,
    // así que la persona lee el mensaje crudo en inglés.
    //
    // Entre las dos salidas se elige la que no puede perder una denuncia: una que
    // llega sin puntero sigue siendo accionable —tiene descripción y capturas— y
    // una rechazada se pierde entera. Para CSAM, no denunciar es peor que denunciar
    // sin señalar.
    //
    // La alternativa era enseñarle al servidor a distinguir «no la trajo» de «no la
    // pudo traer», y eso pide un piso de versión de cliente que este proyecto NO
    // TIENE (no hay `minimumVersion` ni `forceUpdate` en ninguno de los cuatro
    // repos). El día que exista, esta fila puede volver a `REQUIRED`.
    [enums_1.ProfileReportReason.CHILD_EXPLOITATION]: enums_1.ProfileReportContentRequirement.OPTIONAL,
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
