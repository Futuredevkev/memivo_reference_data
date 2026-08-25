"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_MESSAGE_MUTATION_BY_TYPE = void 0;
const enums_1 = require("../enums");
/**
 * EL DUEÑO ÚNICO de «¿esto se puede rehacer o borrar?».
 *
 * ── EL DEFECTO QUE CIERRA, MEDIDO ──────────────────────────────────────────
 * La misma pregunta se contestaba en los dos repos con criterios distintos. El
 * servidor aceptaba editar sólo `TEXT`; la app ofrecía el botón para todo
 * mensaje propio con texto no vacío, que es EXACTAMENTE el conjunto de la
 * media con pie — una foto, un video, un documento o un post compartido con
 * epígrafe. Para todos ésos el botón existía y no funcionaba nunca: la persona
 * escribía el pie nuevo, guardaba, y recibía un 400. No hay caso en que ese
 * botón hiciera algo.
 *
 * Del lado del borrado el desacuerdo era más chico y más feo: las dos puntas
 * COINCIDÍAN por casualidad, no por construcción, y a la de la app le faltaba
 * el escalón que el servidor evalúa PRIMERO —los avisos de sistema no se
 * borran—. Coincidir por casualidad es peor que discrepar: no hay nada que
 * avise cuando deja de pasar.
 *
 * ── POR QUÉ ES UN `Record` TOTAL Y NO DOS LISTAS ───────────────────────────
 * Una lista de «tipos editables» no tiene gate: el próximo `ChatMessageType`
 * queda afuera en silencio y hereda el comportamiento de estar afuera sin que
 * nadie lo haya decidido. Con el `Record` total, agregar un miembro al enum
 * **rompe la compilación de este paquete** hasta que alguien conteste las dos
 * preguntas. Y no puede ser `Partial`: un opcional no obliga a nada — el tipo
 * sin entrada cae a un genérico y se cuela.
 *
 * ── EL CRITERIO, PARA EL PRÓXIMO TIPO ──────────────────────────────────────
 * `edits` contesta *¿qué de esto puede rehacer su autor?* La respuesta es
 * `TEXT` sólo si el texto ES el mensaje: donde el texto acompaña a otra cosa
 * —un archivo, un punto, un post— rehacerlo es rehacer un pie, y eso es un
 * cambio de PRODUCTO que hoy no está tomado. `NONE` es el lado seguro y el que
 * todo tipo nuevo hereda si nadie decide otra cosa.
 *
 * `deletable` contesta *¿esto se puede borrar, con la autoridad que sea?* Lo
 * que la app construye a partir de un hecho del chat y firma nadie —el aviso de
 * que alguien se unió— es la traza de gobernanza del grupo y no se borra. Todo
 * lo que mandó una persona, sí.
 */
exports.CHAT_MESSAGE_MUTATION_BY_TYPE = {
    // El texto ES el mensaje: rehacerlo es rehacer el mensaje entero.
    [enums_1.ChatMessageType.TEXT]: {
        edits: enums_1.ChatEditableContent.TEXT,
        deletable: true,
    },
    /**
     * Los cuatro que llevan algo adentro comparten regla porque comparten el
     * problema: su texto es un PIE, no el mensaje. Editar el pie de una foto
     * sería una decisión de producto —el servidor no la acepta hoy— y es
     * exactamente la que la app se estaba tomando sola. El día que se tome, se
     * cambian estas cuatro líneas y las dos puntas la siguen.
     */
    [enums_1.ChatMessageType.IMAGE]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    [enums_1.ChatMessageType.VIDEO]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    [enums_1.ChatMessageType.AUDIO]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    [enums_1.ChatMessageType.DOCUMENT]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    // Un punto en el mapa no se reescribe: se manda otro. Y en vivo menos, que
    // es un canal abierto y se corta, no se edita.
    [enums_1.ChatMessageType.LOCATION]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    // La pregunta de una encuesta no se toca DESPUÉS de que hay votos: cambiarla
    // reescribiría el sentido de lo que la gente ya votó. Borrarla sí se puede,
    // y se lleva sus votos con ella.
    [enums_1.ChatMessageType.POLL]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    /**
     * El aviso de sistema no se rehace NI se borra, y el segundo es el que
     * importa: es la traza de gobernanza del grupo —quién entró, quién salió,
     * quién cambió qué— y no hay borrado suave. Además no tiene autor, así que
     * borrarlo dispararía el aviso de moderación «X eliminó un mensaje de …»
     * sobre una persona que nunca escribió nada.
     */
    [enums_1.ChatMessageType.SYSTEM]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: false,
    },
    // El post compartido es una REFERENCIA: su texto es el epígrafe con el que
    // alguien lo mandó, no el post. Se saca de la conversación, no se reescribe.
    [enums_1.ChatMessageType.SHARED_POST]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
    /**
     * El sticker no se rehace y sí se borra.
     *
     * `edits: NONE` porque no hay texto que reescribir: el sticker ES el mensaje
     * y no lleva pie. Si alguien quiso mandar otro, manda otro — que es
     * exactamente lo que hace en las apps donde esto ya existe.
     *
     * `deletable: true` por la regla de esta tabla: todo lo que mandó una PERSONA
     * se puede sacar de la conversación. Borrar el mensaje no toca la fila de
     * `stickers`, y eso es a propósito: esa fila la comparten todos los mensajes
     * que mandaron el mismo sticker, así que borrarla sería romperle la burbuja a
     * terceros.
     */
    [enums_1.ChatMessageType.STICKER]: {
        edits: enums_1.ChatEditableContent.NONE,
        deletable: true,
    },
};
