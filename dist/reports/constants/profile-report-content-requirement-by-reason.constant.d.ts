import { ProfileReportContentRequirement, ProfileReportReason } from '../enums';
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
export declare const PROFILE_REPORT_CONTENT_REQUIREMENT_BY_REASON: Readonly<Record<ProfileReportReason, ProfileReportContentRequirement>>;
