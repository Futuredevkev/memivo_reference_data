/**
 * Reenviar un mensaje que ya existe a OTRO grupo de chat.
 *
 * El grupo de DESTINO va en la URL, igual que en los otros dos altas de mensaje
 * de este directorio; acá viaja el ORIGEN.
 *
 * **No lleva `albumId`, y ahí se separa de sus hermanos a propósito.** Los otros
 * dos lo reciben para contrastar lo que el cliente cree contra la realidad; acá
 * el álbum no es un dato de coherencia sino LA FRONTERA —un reenvío nunca sale
 * del álbum— así que se resuelve del grupo de destino, que es la única fuente
 * que no puede discrepar, y con ése se valida el grupo de origen. Recibirlo del
 * cliente abriría un segundo camino para decidir cuál es el álbum de la
 * operación, que es exactamente el lugar donde no puede haber dos.
 *
 * No hay `caption`: un reenvío es una mudanza, no un mensaje nuevo. El texto que
 * llega es el que escribió el autor original —en un media, su epígrafe—, y
 * agregarle una segunda leyenda dejaría en la misma burbuja palabras de dos
 * personas sin forma de decir cuáles son de quién. Quien quiera comentar el
 * reenvío escribe un mensaje aparte, que ya puede hacer.
 *
 * Tampoco hay `replyToMessageId`: la cita ata un mensaje a otro DE SU CHAT, y el
 * reenvío justamente cambia de chat.
 *
 * `clientTempId` es la clave de deduplicación, por la misma razón que en los
 * hermanos: el `catch` del cliente reporta el fallo DESPUÉS de que el INSERT ya
 * ocurrió, así que invita al reintento, y sin la clave el reintento duplica la
 * burbuja.
 */
export interface ForwardChatMessageRequest {
  sourceMessageId: string;
  clientTempId?: string;
}
