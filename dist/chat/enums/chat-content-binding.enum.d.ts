/**
 * Los ESTADOS que atan un mensaje al chat donde nació, aunque su tipo sí pueda
 * mudarse.
 *
 * Existe porque el tipo no alcanza, y eso ya está medido en dos casos: el
 * view-once es una BANDERA sobre `IMAGE`/`VIDEO`/`AUDIO` —los tres tipos más
 * reenviables que hay— y la ubicación EN VIVO va a ser un estado de `LOCATION`,
 * cuya variante fija sí se reenvía. Una política que mirara sólo el `type`
 * reenviaría las dos: la foto que se veía una vez y la posición que todavía se
 * está transmitiendo.
 *
 * Cada miembro obliga a escribir su predicado en
 * `CHAT_CONTENT_BINDING_HOLDS`, y el predicado obliga a que
 * `RelocatableChatMessage` traiga el campo que ese predicado lee. Es la cadena
 * que hace que agregar un estado nuevo no se pueda hacer a medias.
 */
export declare enum ChatContentBinding {
    /**
     * Se ve una sola vez. Mudarlo a otro chat le regalaría a otra sala una vista
     * de algo que se mandó para verse una vez, en ESTA.
     */
    VIEW_ONCE = "VIEW_ONCE"
}
