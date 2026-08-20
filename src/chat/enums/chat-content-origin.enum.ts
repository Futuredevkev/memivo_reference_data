/**
 * Quién armó el contenido de un mensaje: la PERSONA o la APP.
 *
 * Es el eje que decide si un mensaje puede mudarse a otro chat, y se eligió a
 * propósito en vez de una lista de tipos reenviables. Una lista no tiene gate:
 * el próximo `ChatMessageType` entra en silencio al comportamiento viejo, y el
 * comportamiento viejo de una lista de permitidos es «no está, no se reenvía»
 * sólo por accidente — nadie lo decidió (ORDEN §6).
 *
 * Con el origen, la pregunta que hay que contestar para un tipo nuevo es una
 * sola y no admite default: *¿esto lo escribió alguien, o lo construyó la app?*
 * Lo que construye la app —el aviso de que alguien se unió al grupo, la
 * encuesta cuyos votos viven en su chat— no significa nada fuera del chat donde
 * nació, así que **todo tipo futuro nace no reenviable**, que es el lado seguro.
 */
export enum ChatContentOrigin {
  /** Lo escribió, grabó, sacó o eligió una persona. */
  PERSON = 'PERSON',
  /** Lo construyó la app a partir de un hecho de ESE chat. */
  APP = 'APP',
}
