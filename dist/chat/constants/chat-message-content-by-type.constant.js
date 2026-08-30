"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_MESSAGE_CONTENT_BY_TYPE = void 0;
const enums_1 = require("../enums");
/**
 * EL CATÁLOGO de qué contenido lleva cada `ChatMessageType`, y es uno solo.
 *
 * ── EL DEFECTO QUE CIERRA, MEDIDO ──────────────────────────────────────────
 * Antes de esta tabla, «qué tipos llevan archivos» vivía en un array escrito a
 * mano (`CHAT_MEDIA_MESSAGE_TYPES`) del que colgaban CUATRO cosas: el `@IsIn`
 * del finalize de subida, el validador que autoriza el alta de media, el
 * filtro de la galería y el `WHERE` de un índice parcial de Postgres. Agregar
 * `DOCUMENT` al enum sin tocar ese array no rompía nada: el tipo nuevo quedaba
 * afuera de las cuatro, y ninguna de las cuatro se pone roja por eso.
 *
 * Con el `Record` TOTAL, el enum y la tabla viven en el mismo paquete, así que
 * **un miembro nuevo rompe el build de los tres repos hasta clasificarlo**. No
 * hay default del que colgarse y no hay `Partial`: un opcional no obliga a
 * nada — el tipo sin entrada cae a un genérico y se cuela.
 *
 * ── EL CRITERIO, PARA EL PRÓXIMO TIPO ──────────────────────────────────────
 * `payload` contesta *¿qué trae adentro además de texto?* — y si la respuesta
 * es `FILES`, el tipo entra al pipeline de subida y hereda su validación de
 * MIME y de tamaño. `inMediaGallery` contesta *¿la pestaña de multimedia lo
 * lista?*, que NO es lo mismo: la galería sabe dibujar una miniatura, una fila
 * de audio y una fila de documento, y lo que este campo decide es si el tipo
 * aparece ahí — no con qué se lo dibuja, que es del cliente.
 *
 * ⚠️ **Los dos campos dan hoy el MISMO conjunto, y no son el mismo campo.**
 * Desde que el documento entró a la galería, «lleva archivos» y «se lista en la
 * galería» coinciden extensionalmente. Eso es una coincidencia de este momento,
 * no una identidad: la ubicación ya contesta distinto a la primera y podría
 * contestar distinto a la segunda, y un tipo futuro que lleve archivos que no
 * se listen —un adjunto de sistema, por ejemplo— vuelve a separarlas. Colapsar
 * las dos preguntas en una porque hoy dan igual es exactamente la lectura
 * apurada que N-417 dejó advertida.
 *
 * ── POR QUÉ `satisfies` Y NO UNA ANOTACIÓN `: Record<…>` ───────────────────
 * Las dos formas obligan a que el `Record` sea TOTAL, que es lo que importa.
 * La anotación, además, ENSANCHA los valores al tipo de la interfaz, y con eso
 * se pierde qué contestó cada tipo: las dos listas derivadas dejan de poder
 * angostarse y `ChatMediaMessageType` vuelve a ser el enum entero, o sea que
 * el `Record<ChatMediaMessageType, …>` del validador de media pasaría a exigir
 * una entrada para TEXT, POLL y SYSTEM. Con `satisfies`, el compilador
 * verifica la totalidad y conserva los literales.
 *
 * ⚠️ **`inMediaGallery` no se cambia de a una línea**: gobierna el `WHERE` de
 * `IDX_chat_messages_group_media`. Un tipo que pasa a `true` necesita
 * migración que recree el índice, y hay un gate que compara las dos cosas.
 */
exports.CHAT_MESSAGE_CONTENT_BY_TYPE = {
    // Texto propio: no hay carga que autorizar ni archivo que mostrar.
    [enums_1.ChatMessageType.TEXT]: {
        payload: enums_1.ChatContentPayload.NONE,
        inMediaGallery: false,
    },
    // Los tres de media comparten regla porque comparten el problema: llevan
    // archivos que la galería sabe dibujar (miniatura) o reproducir (audio).
    [enums_1.ChatMessageType.IMAGE]: {
        payload: enums_1.ChatContentPayload.FILES,
        inMediaGallery: true,
    },
    [enums_1.ChatMessageType.VIDEO]: {
        payload: enums_1.ChatContentPayload.FILES,
        inMediaGallery: true,
    },
    [enums_1.ChatMessageType.AUDIO]: {
        payload: enums_1.ChatContentPayload.FILES,
        inMediaGallery: true,
    },
    /**
     * El documento lleva archivos y SÍ entra a la galería, con su chip propio y
     * su lista aparte.
     *
     * ── ESTA LÍNEA DECÍA `false` HASTA EL 21 DE AGOSTO DE 2026 ────────────────
     * La decisión de dejarlo afuera estaba escrita acá y era de ALCANCE, no de
     * producto: la galería era una grilla de miniaturas más una lista de audios,
     * y meter un `.pdf` pedía un tercer modo de lista que aquella ola no iba a
     * construir. El costo estaba declarado y era el que decidió: **un documento
     * viejo sólo se encontraba scrolleando la conversación**, que es exactamente
     * el problema que la pestaña de multimedia existe para resolver. El dueño lo
     * dio vuelta, y el motivo es de consistencia entre superficies — el mismo
     * contenido no puede tener dos respuestas según dónde se lo busque.
     *
     * ── LO QUE ESTA LÍNEA MUEVE, Y ES POR QUÉ ES UNA LÍNEA ────────────────────
     * De acá cuelgan el filtro de la query, el tipo angosto de los chips, el
     * `Record` total que decide cómo dibuja la galería cada tipo, y el `WHERE` de
     * `IDX_chat_messages_group_media`. Ninguno se escribe a mano: los cuatro se
     * derivan. Lo único que NO se deriva es la BASE —`synchronize` está apagado en
     * producción, así que el índice físico no se mueve solo— y por eso hay una
     * migración que lo recrea y un gate que compara las dos cosas contra esta
     * tabla.
     */
    [enums_1.ChatMessageType.DOCUMENT]: {
        payload: enums_1.ChatContentPayload.FILES,
        inMediaGallery: true,
    },
    /**
     * La ubicación no lleva NADA que subir y no entra a la galería.
     *
     * `payload: NONE` es lo que la separa del documento: un punto son dos
     * números que viajan en la fila del mensaje, no un archivo — así que este
     * tipo no toca el pipeline de subida, ni su allowlist de MIME, ni su tope de
     * tamaño. Es la misma respuesta que da `TEXT`, y por el mismo motivo.
     *
     * `inMediaGallery: false` por construcción: la galería dibuja miniaturas y
     * reproduce audio, y acá no hay ni un archivo del que sacar una. No es una
     * decisión de alcance como la del documento —donde SÍ hay archivos y se
     * eligió dejarlos afuera—: acá no hay nada que mostrar.
     *
     * ⚠️ Lo que este catálogo NO contesta es si se muda a otro chat, y en este
     * tipo esa respuesta depende de un ESTADO y no del tipo: un punto fijo se
     * reenvía y un compartir EN VIVO no. Eso lo decide
     * `CHAT_CONTENT_RELOCATION_BY_TYPE` con `ChatContentBinding.LIVE`.
     */
    [enums_1.ChatMessageType.LOCATION]: {
        payload: enums_1.ChatContentPayload.NONE,
        inMediaGallery: false,
    },
    // Una encuesta ES de su chat: sus votos viven ahí y no trae archivos.
    [enums_1.ChatMessageType.POLL]: {
        payload: enums_1.ChatContentPayload.NONE,
        inMediaGallery: false,
    },
    // «Fulano se unió al grupo»: lo construye la app y no lleva nada adentro.
    [enums_1.ChatMessageType.SYSTEM]: {
        payload: enums_1.ChatContentPayload.NONE,
        inMediaGallery: false,
    },
    // El post no es un archivo del chat: es una referencia que en el destino se
    // vuelve a resolver contra el álbum y el bloqueo de quien mira.
    [enums_1.ChatMessageType.SHARED_POST]: {
        payload: enums_1.ChatContentPayload.SHARED_POST,
        inMediaGallery: false,
    },
    /**
     * El sticker lleva una REFERENCIA a un catálogo externo, y no entra a la
     * galería.
     *
     * `payload: STICKER` y no `FILES`, y la diferencia decide tres cosas de una:
     * el tipo NO entra al pipeline de subida, NO hereda su allowlist de MIME ni
     * su tope de tamaño, y NO crea una fila de archivo por envío. Un sticker
     * mandado diez mil veces son diez mil mensajes apuntando a UNA fila; por
     * `FILES` habrían sido diez mil archivos sobre un asset que ni siquiera es
     * nuestro.
     *
     * `inMediaGallery: false` a conciencia, y no por alcance: la pestaña de
     * multimedia existe para volver a encontrar lo que se mandó al ÁLBUM —las
     * fotos, los videos, los audios, los documentos— y un sticker no es un
     * recuerdo, es un gesto. Mezclarlo con las fotos de un cumpleaños haría más
     * difícil encontrar las fotos, que es justo lo contrario de para qué está esa
     * pestaña.
     *
     * ⚠️ Y esta línea NO es gratis de cambiar: gobierna el `WHERE` de
     * `IDX_chat_messages_group_media`. Pasarla a `true` pide una migración que
     * recree el índice, y hay un gate que compara las dos cosas contra esta tabla.
     */
    [enums_1.ChatMessageType.STICKER]: {
        payload: enums_1.ChatContentPayload.STICKER,
        inMediaGallery: false,
    },
};
