import { CHAT_CONTENT_BINDING_HOLDS } from './chat-content-binding-holds.constant';
import { CHAT_CONTENT_RELOCATION_BY_TYPE } from './chat-content-relocation-by-type.constant';
import { CHAT_MESSAGE_CONTENT_BY_TYPE } from './chat-message-content-by-type.constant';
import { ChatContentOrigin } from '../enums';
import type { RelocatableChatMessage } from '../interfaces';
import type { ChatRelocationVerdict } from '../types';

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
export const canRelocateChatContent = (
  message: RelocatableChatMessage,
): ChatRelocationVerdict => {
  const rule = CHAT_CONTENT_RELOCATION_BY_TYPE[message.type];
  if (rule.origin === ChatContentOrigin.APP) return { allowed: false };

  const isBound = rule.boundBy.some((binding) =>
    CHAT_CONTENT_BINDING_HOLDS[binding](message),
  );
  if (isBound) return { allowed: false };

  return {
    allowed: true,
    carries: CHAT_MESSAGE_CONTENT_BY_TYPE[message.type].payload,
  };
};
