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
 * MIME y de tamaño. `inMediaGallery` contesta *¿sus archivos se pueden dibujar
 * como miniatura en una grilla o escuchar en una lista?*, que es lo único que
 * la galería sabe hacer.
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
     * El documento lleva archivos y NO entra a la galería, y ésa es la única
     * entrada de la tabla donde las dos respuestas se separan.
     *
     * La galería es una grilla de miniaturas más una lista de audios: un `.pdf`
     * no tiene miniatura que poner en la celda ni nada que reproducir, y el visor
     * al que la grilla abre sólo sabe de imagen y video. Meterlo ahí pedía un
     * tercer modo de lista y una celda nueva — superficie que esta ola no
     * construye. Queda declarado como deuda: hoy un documento viejo se encuentra
     * scrolleando la conversación.
     */
    [enums_1.ChatMessageType.DOCUMENT]: {
        payload: enums_1.ChatContentPayload.FILES,
        inMediaGallery: false,
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
};
