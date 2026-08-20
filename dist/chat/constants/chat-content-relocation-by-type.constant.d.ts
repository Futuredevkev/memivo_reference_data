import { ChatMessageType } from '../enums';
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
 * carga (para poder volver a autorizarla en el destino) y qué estados lo atan
 * igual a su chat.
 */
export declare const CHAT_CONTENT_RELOCATION_BY_TYPE: Record<ChatMessageType, ChatContentRelocationRule>;
