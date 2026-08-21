/**
 * Los ESTADOS que atan un mensaje al chat donde nació, aunque su tipo sí pueda
 * mudarse.
 *
 * Existe porque el tipo no alcanza, y los dos miembros lo prueban por lados
 * distintos: el view-once es una BANDERA sobre `IMAGE`/`VIDEO`/`AUDIO` —los
 * tres tipos más reenviables que hay— y el compartir en vivo es un ESTADO de
 * `LOCATION`, cuya variante fija sí se reenvía. Una política que mirara sólo el
 * `type` reenviaría las dos: la foto que se veía una vez y la posición que
 * todavía se está transmitiendo.
 *
 * Cada miembro obliga a escribir su predicado en
 * `CHAT_CONTENT_BINDING_HOLDS`, y el predicado obliga a que
 * `RelocatableChatMessage` traiga el campo que ese predicado lee. Es la cadena
 * que hace que agregar un estado nuevo no se pueda hacer a medias.
 */
export enum ChatContentBinding {
  /**
   * Se ve una sola vez. Mudarlo a otro chat le regalaría a otra sala una vista
   * de algo que se mandó para verse una vez, en ESTA.
   */
  VIEW_ONCE = 'VIEW_ONCE',
  /**
   * Es un compartir de ubicación EN VIVO.
   *
   * Un punto fijo es la foto de un mapa y se reenvía; esto no es un dato, es un
   * CANAL abierto — reenviarlo transmitiría la posición en tiempo real de una
   * persona a una sala que esa persona nunca eligió. Decisión del dueño del 16
   * de agosto.
   *
   * ⚠️ **Ata para siempre, no «mientras dure»**, y ésa es la parte que no se
   * puede aflojar. Si el predicado mirara el reloj, el mismo mensaje sería
   * reenviable o no según CUÁNDO se pregunte, y las dos puntas —que preguntan
   * con relojes distintos— podrían contestar cosas distintas sobre la misma
   * fila. Un compartir vencido tampoco tiene nada que mudar: su posición vivía
   * en Redis y ya no está.
   */
  LIVE = 'LIVE',
}
