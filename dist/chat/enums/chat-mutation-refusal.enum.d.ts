/**
 * POR QUÉ la puerta dijo que no a rehacer o a borrar un mensaje.
 *
 * ── ESTE VERDICTO SÍ TRAE MOTIVO, Y SU HERMANO NO ──────────────────────────
 * `ChatRelocationVerdict` declara —con razón— que su «no» no lleva motivo
 * porque no tiene lector NUNCA: el único camino que llega ahí es una request
 * armada a mano. Acá el motivo TIENE lector y es el servidor: las dos
 * negativas de la edición salen por códigos HTTP distintos —un 403
 * `CHAT_MESSAGE_FORBIDDEN` cuando quien pregunta no es el autor, un 400
 * `CHAT_MESSAGE_EDIT_UNSUPPORTED` cuando el tipo no admite reescritura— y sin
 * el motivo el guard tendría que volver a decidir cuál de las dos fue, o sea
 * decidir por segunda vez lo que la puerta ya decidió (ORDEN §1).
 * ── LOS DOS EJES SE NOMBRAN SEPARADOS A PROPÓSITO ──────────────────────────
 * `CONTENT_IS_IMMUTABLE` es «este tipo no deja rehacer su texto» y
 * `MESSAGE_IS_IMMUTABLE` es «este mensaje no se borra». Colapsarlos en un solo
 * miembro porque hoy los dos apuntan al mismo tipo de mensaje sería la lectura
 * apurada: son preguntas distintas —una encuesta se borra y no se reescribe— y
 * el día que un tipo conteste distinto a cada una el miembro único no podría
 * decir cuál falló.
 */
export declare enum ChatMutationRefusal {
    /** Quien pregunta no escribió el mensaje. Sólo el autor lo reescribe. */
    NOT_THE_AUTHOR = "NOT_THE_AUTHOR",
    /** El tipo del mensaje no admite que se rehaga su contenido. */
    CONTENT_IS_IMMUTABLE = "CONTENT_IS_IMMUTABLE",
    /** El tipo del mensaje no admite que se lo borre. */
    MESSAGE_IS_IMMUTABLE = "MESSAGE_IS_IMMUTABLE",
    /** Quien pregunta no tiene autoridad sobre ese mensaje en ese chat. */
    NOT_AUTHORIZED = "NOT_AUTHORIZED"
}
