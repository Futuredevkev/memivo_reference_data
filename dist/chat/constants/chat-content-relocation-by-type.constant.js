"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_CONTENT_RELOCATION_BY_TYPE = void 0;
const enums_1 = require("../enums");
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
exports.CHAT_CONTENT_RELOCATION_BY_TYPE = {
    // Texto propio: no hay nada más que autorizar en el destino.
    [enums_1.ChatMessageType.TEXT]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [],
    },
    // Los tres de media comparten regla porque comparten el problema: llevan
    // archivos, y pueden venir marcados para verse una sola vez.
    [enums_1.ChatMessageType.IMAGE]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [enums_1.ChatContentBinding.VIEW_ONCE],
    },
    [enums_1.ChatMessageType.VIDEO]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [enums_1.ChatContentBinding.VIEW_ONCE],
    },
    [enums_1.ChatMessageType.AUDIO]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [enums_1.ChatContentBinding.VIEW_ONCE],
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
    [enums_1.ChatMessageType.DOCUMENT]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [],
    },
    // El post lo eligió una persona, y en el destino se vuelve a resolver: a qué
    // álbum pertenece y si hay bloqueo con su autor. La vista previa ya se pinta
    // con el permiso de QUIEN MIRA —cada cliente pide el post con su propia
    // sesión— así que mudar el mensaje no le muestra a nadie un post que no
    // podría abrir por su cuenta.
    [enums_1.ChatMessageType.SHARED_POST]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [],
    },
    /**
     * La ubicación la eligió una persona, así que por ORIGEN se muda — pero
     * **sólo la fija**, y ahí está todo el filo de este tipo.
     *
     * ── «EN VIVO» NO ES UN TIPO, ES UN ESTADO ────────────────────────────────
     * Una política que mirara sólo el `type` reenviaría las dos variantes, y la
     * segunda no es un dato: es un CANAL abierto. Un punto fijo es la foto de un
     * mapa —quien lo recibe ve dónde estuvo alguien en un momento— y un
     * compartir en vivo reenviado **transmitiría la posición en tiempo real de
     * una persona a gente que esa persona nunca eligió**. Decisión del dueño del
     * 16 de agosto, y es la misma clase de trampa que el view-once: la diferencia
     * no vive en el `type` sino en un estado de la fila, y por eso se declara con
     * `ChatContentBinding` y no con un tipo aparte.
     *
     * Un `LOCATION_LIVE` como noveno miembro del enum habría sido la otra salida
     * y es peor: duplicaría cada entrada de las seis tablas por tipo para
     * expresar un estado que sólo importa en ESTA pregunta.
     */
    [enums_1.ChatMessageType.LOCATION]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [enums_1.ChatContentBinding.LIVE],
    },
    // Una encuesta ES de su chat: sus votos y su cierre viven ahí. Mudarla
    // partiría los votos entre dos salas o los filtraría de una a la otra.
    [enums_1.ChatMessageType.POLL]: { origin: enums_1.ChatContentOrigin.APP },
    // «Fulano se unió al grupo» fuera de su grupo no significa nada, y además no
    // tiene autor: es la app contando un hecho de ESA sala.
    [enums_1.ChatMessageType.SYSTEM]: { origin: enums_1.ChatContentOrigin.APP },
    /**
     * El sticker lo eligió una persona, así que se muda — y sin ningún estado que
     * lo ate a su chat.
     *
     * `boundBy` VACÍO, y no es un olvido. Los dos estados que existen no lo
     * pueden alcanzar: un sticker **no puede ser view-once** —esa marca vive
     * sobre archivos subidos y un sticker no sube nada— y `LIVE` es de la
     * ubicación. Declarar cualquiera de los dos acá dejaría una rama que
     * producción no puede alcanzar (ORDEN §7).
     *
     * Y en el destino no hay nada que volver a autorizar: el catálogo es externo,
     * público y el mismo para todos, así que mudar el mensaje no le muestra a
     * nadie algo que no pudiera encontrar buscando por su cuenta. Es la
     * diferencia con `SHARED_POST`, que sí se re-resuelve contra el álbum y el
     * bloqueo de quien mira.
     */
    [enums_1.ChatMessageType.STICKER]: {
        origin: enums_1.ChatContentOrigin.PERSON,
        boundBy: [],
    },
};
