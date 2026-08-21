import type { ChatLiveLocationResponse } from '../../chat/interfaces/chat-live-location-response.interface';

/**
 * Una posición nueva de un compartir en vivo, tal como sale por el socket.
 *
 * Es la MISMA forma que devuelve el estado inicial por REST, y a propósito: el
 * cliente guarda las dos en el mismo lugar, así que dos formas distintas
 * obligarían a normalizar una a la otra —o, peor, a dibujar dos veces lo mismo
 * (ORDEN §1)—.
 *
 * ⚠️ **Este evento NO sale al room pelado.** La posición física de una persona
 * es el único payload del chat donde que el cliente descarte el dato no
 * alcanza: el dato ya salió del servidor. Se emite excluyendo a quien no puede
 * ver a quien comparte, del lado del servidor, antes del emit.
 */
export type ChatLiveLocationUpdatedPayload = ChatLiveLocationResponse<string>;
