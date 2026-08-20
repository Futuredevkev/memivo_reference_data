import { ChatContentBinding, ChatContentOrigin, ChatMessageType } from '../enums';
import type { ChatContentRelocationRule } from '../interfaces';

/**
 * EL DUEÑO de «¿esto puede entrar a otro chat?», y es uno solo.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Un mensaje lleva adentro el permiso que lo puso en su chat, y ese permiso no
 * viaja con él: mudarlo cruza una frontera. Antes de esta tabla no había dónde
 * contestar eso, así que cada superficie que quisiera mover contenido —el
 * reenvío, y después los documentos y la ubicación— iba a escribir su propia
 * comprobación. Tres copias de la misma decisión, con tres criterios que se
 * desincronizan (ORDEN §1).
 *
 * ── POR QUÉ ES UN `Record` TOTAL Y NO UNA LISTA ────────────────────────────
 * Una lista de tipos reenviables no tiene gate: el próximo `ChatMessageType`
 * entra en silencio, y hereda el comportamiento de estar afuera de la lista sin
 * que nadie lo haya decidido. Con el `Record` total, agregar un miembro al enum
 * **rompe la compilación de este paquete** hasta que alguien clasifique el tipo
 * nuevo. Es la única forma de que la decisión se tome a conciencia (ORDEN §6).
 *
 * Y el `Record` **no puede ser `Partial`**: un opcional no obliga a nada — el
 * tipo sin entrada no falla ruidoso, cae a un genérico y se cuela.
 *
 * ── EL CRITERIO, PARA EL PRÓXIMO TIPO ──────────────────────────────────────
 * *Se muda lo que la PERSONA mandó, no lo que la APP construyó.* Si el mensaje
 * lo armó la app a partir de un hecho de ESE chat, `APP` y se terminó. Si lo
 * escribió, grabó o eligió alguien, `PERSON` — y entonces hay que contestar qué
 * estados lo atan igual a su chat. **Qué CARGA lleva no se contesta acá**: eso
 * lo dice `CHAT_MESSAGE_CONTENT_BY_TYPE`, que es la tabla que también gobierna
 * el pipeline de subida, y la puerta lo lee de ahí para no declararlo dos veces.
 */
export const CHAT_CONTENT_RELOCATION_BY_TYPE: Record<
  ChatMessageType,
  ChatContentRelocationRule
> = {
  // Texto propio: no hay nada más que autorizar en el destino.
  [ChatMessageType.TEXT]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [],
  },
  // Los tres de media comparten regla porque comparten el problema: llevan
  // archivos, y pueden venir marcados para verse una sola vez.
  [ChatMessageType.IMAGE]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [ChatContentBinding.VIEW_ONCE],
  },
  [ChatMessageType.VIDEO]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [ChatContentBinding.VIEW_ONCE],
  },
  [ChatMessageType.AUDIO]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [ChatContentBinding.VIEW_ONCE],
  },
  /**
   * El documento lo mandó una persona, así que se muda — la regla de ORIGEN no
   * distingue entre una foto y un `.pdf`, y no tiene por qué: en los dos casos
   * lo que llega al destino son archivos del mismo álbum, que ya se
   * referencian sin volver a subirse.
   *
   * `boundBy` VACÍO, y no es un olvido: un documento **no puede ser
   * view-once**. El servidor rechaza esa combinación en el alta, así que
   * declarar `VIEW_ONCE` acá dejaría una rama que producción no puede alcanzar
   * (ORDEN §7) — y el rechazo del alta y esta lista leen el mismo dato, así
   * que no hay forma de que se contradigan.
   */
  [ChatMessageType.DOCUMENT]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [],
  },
  // El post lo eligió una persona, y en el destino se vuelve a resolver: a qué
  // álbum pertenece y si hay bloqueo con su autor. La vista previa ya se pinta
  // con el permiso de QUIEN MIRA —cada cliente pide el post con su propia
  // sesión— así que mudar el mensaje no le muestra a nadie un post que no
  // podría abrir por su cuenta.
  [ChatMessageType.SHARED_POST]: {
    origin: ChatContentOrigin.PERSON,
    boundBy: [],
  },
  // Una encuesta ES de su chat: sus votos y su cierre viven ahí. Mudarla
  // partiría los votos entre dos salas o los filtraría de una a la otra.
  [ChatMessageType.POLL]: { origin: ChatContentOrigin.APP },
  // «Fulano se unió al grupo» fuera de su grupo no significa nada, y además no
  // tiene autor: es la app contando un hecho de ESA sala.
  [ChatMessageType.SYSTEM]: { origin: ChatContentOrigin.APP },
};
