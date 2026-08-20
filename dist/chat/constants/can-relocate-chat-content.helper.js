"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canRelocateChatContent = void 0;
const chat_content_binding_holds_constant_1 = require("./chat-content-binding-holds.constant");
const chat_content_relocation_by_type_constant_1 = require("./chat-content-relocation-by-type.constant");
const chat_message_content_by_type_constant_1 = require("./chat-message-content-by-type.constant");
const enums_1 = require("../enums");
/**
 * LA PUERTA. Contesta si este contenido puede entrar a otro chat, y qué se
 * lleva con él.
 *
 * Es la única forma de preguntarlo: el `Record` que decide es interno a esta
 * carpeta en la práctica —nadie más tiene por qué recorrerlo— y los dos repos
 * llaman a esta función. El api la usa como gate del reenvío y el cliente para
 * decidir si ofrece el botón, así que **las dos puntas contestan lo mismo por
 * construcción**: la app no puede ofrecer algo que el servidor va a rechazar, y
 * el servidor no puede ser más permisivo que lo que la app muestra.
 *
 * Vive del lado del contrato y no en el api por eso mismo. Un gate que sólo
 * viviera en el servidor dejaría al cliente escribiendo su propia lista de
 * tipos reenviables, que es la segunda copia de la decisión que
 * `CHAT_CONTENT_RELOCATION_BY_TYPE` existe para impedir.
 *
 * Lee el mensaje entero y no sólo su `type` porque el tipo no alcanza: un
 * view-once es un `IMAGE` con una bandera puesta.
 *
 * LA CARGA SALE DEL CATÁLOGO Y NO DE LA REGLA. Son dos tablas y contestan
 * preguntas distintas —`CHAT_CONTENT_RELOCATION_BY_TYPE` dice si se muda,
 * `CHAT_MESSAGE_CONTENT_BY_TYPE` dice qué lleva adentro—, y la segunda existe
 * porque el pipeline de subida necesita la misma respuesta. Antes la carga
 * estaba declarada en las dos, que es la duplicación que §1 no permite; ahora
 * se declara una vez y la puerta la devuelve adentro del veredicto para que el
 * ejecutor de la mudanza no tenga que volver a mirar el `type`.
 */
const canRelocateChatContent = (message) => {
    const rule = chat_content_relocation_by_type_constant_1.CHAT_CONTENT_RELOCATION_BY_TYPE[message.type];
    if (rule.origin === enums_1.ChatContentOrigin.APP)
        return { allowed: false };
    const isBound = rule.boundBy.some((binding) => chat_content_binding_holds_constant_1.CHAT_CONTENT_BINDING_HOLDS[binding](message));
    if (isBound)
        return { allowed: false };
    return {
        allowed: true,
        carries: chat_message_content_by_type_constant_1.CHAT_MESSAGE_CONTENT_BY_TYPE[message.type].payload,
    };
};
exports.canRelocateChatContent = canRelocateChatContent;
