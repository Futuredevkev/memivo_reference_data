import type { ChatContentPayload } from '../enums';
/**
 * La respuesta de la puerta: si este contenido puede entrar a otro chat.
 *
 * El «sí» viene con la carga adentro y no como un dato aparte, porque quien
 * autoriza la mudanza es el mismo que después la ejecuta: separarlos dejaría al
 * ejecutor volviendo a mirar el `type` para saber qué copiar, o sea decidiendo
 * por segunda vez lo que la puerta ya decidió (ORDEN §1).
 *
 * El «no» NO trae motivo, y es a propósito. El único camino que llega a un «no»
 * es una request armada a mano —la app pregunta antes de ofrecer el botón—, así
 * que el motivo no tiene lector: sería superficie muerta con forma de dato. Por
 * qué cada tipo cae de un lado o del otro está escrito en
 * `CHAT_CONTENT_RELOCATION_BY_TYPE`, que es donde se decide.
 */
export type ChatRelocationVerdict = {
    readonly allowed: true;
    readonly carries: ChatContentPayload;
} | {
    readonly allowed: false;
};
