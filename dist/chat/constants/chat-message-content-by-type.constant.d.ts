import { ChatContentPayload } from '../enums';
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
export declare const CHAT_MESSAGE_CONTENT_BY_TYPE: {
    TEXT: {
        payload: ChatContentPayload.NONE;
        inMediaGallery: false;
    };
    IMAGE: {
        payload: ChatContentPayload.FILES;
        inMediaGallery: true;
    };
    VIDEO: {
        payload: ChatContentPayload.FILES;
        inMediaGallery: true;
    };
    AUDIO: {
        payload: ChatContentPayload.FILES;
        inMediaGallery: true;
    };
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
    DOCUMENT: {
        payload: ChatContentPayload.FILES;
        inMediaGallery: false;
    };
    POLL: {
        payload: ChatContentPayload.NONE;
        inMediaGallery: false;
    };
    SYSTEM: {
        payload: ChatContentPayload.NONE;
        inMediaGallery: false;
    };
    SHARED_POST: {
        payload: ChatContentPayload.SHARED_POST;
        inMediaGallery: false;
    };
};
