import type { ChatMessageType } from '../enums';
/**
 * Lo MÍNIMO que hay que saber de un mensaje para contestar si se puede rehacer
 * o borrar.
 *
 * No es un `Pick<ChatMessageResponse, …>` a propósito, por el mismo motivo que
 * `RelocatableChatMessage`: el api pregunta con una fila de la base y el
 * cliente con el mensaje ya normalizado, y las dos formas satisfacen esto sin
 * que ninguna se convierta a la otra. Que el mínimo esté escrito es lo que
 * impide que la puerta empiece a leer campos que uno de los dos lados no tiene.
 *
 * **No trae `content`, y no es un olvido.** El criterio de hoy es el TIPO, y
 * ése es justo el defecto que esta pieza cierra: la app decidía por «tiene
 * texto no vacío», o sea por el contenido, y ese conjunto —media con pie— era
 * exactamente el que el servidor rechazaba siempre. Un campo que la regla no
 * lee no entra a la forma mínima: si mañana la regla lo necesitara, se agrega
 * acá y los dos lados se enteran por el compilador.
 */
export interface MutableChatMessage {
    readonly type: ChatMessageType;
    /**
     * NULLABLE porque el mensaje de SISTEMA no tiene autor: lo construye la app
     * a partir de un hecho del chat. Declararlo `string` a secas obligaría a
     * quien pregunta a fabricar un id para un mensaje que no lo tiene, y un dato
     * fabricado se lee como medido.
     */
    readonly senderId: string | null;
}
