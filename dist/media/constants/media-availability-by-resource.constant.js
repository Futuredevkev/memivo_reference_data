"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEDIA_AVAILABILITY_BY_RESOURCE = void 0;
const resource_type_enum_1 = require("../enums/resource-type.enum");
/**
 * QUÉ TIPO DE RECURSO PUEDE AVISAR QUE MURIÓ.
 *
 * ── POR QUÉ ESTA TABLA VIVE EN EL CONTRATO Y NO EN EL SERVIDOR ────────────
 * Vivía en el api, y ahí estaba incompleta: decide qué archivos sondea la
 * reconciliación de fondo, que parece una decisión operativa del servidor —y lo
 * es— pero **gobierna una promesa del cable**. Un payload sólo puede declarar
 * [MediaAvailability] si el recurso del que sale está acá en `true`; si no, el
 * campo viaja siempre en `false` y el tipo promete un dato que nadie mantiene.
 *
 * Eso ya pasó, y es el defecto que esta mudanza cierra: la portada del álbum
 * declaraba la forma mientras `ALBUM_COVER` estaba excluido del barrido. Nadie
 * mintió a propósito — no había nada que lo impidiera. Con la tabla acá, el
 * cruce contra [MEDIA_AVAILABILITY_CARRIERS] es un gate y no una revisión.
 *
 * ── EL CRITERIO PARA CLASIFICAR UN RECURSO NUEVO ──────────────────────────
 * No es «¿esto es media?». Es: **¿la superficie que lo dibuja ofrecería un
 * reintento imposible, o dejaría un hueco que hay que explicar?**
 *
 *  · El contenido —fotos, videos, audio, documentos, historias— va en `true`:
 *    tiene reintento, y sobre un asset que ya no existe ese botón falla hoy,
 *    mañana y siempre.
 *  · Lo DECORATIVO con repliegue completo va en `false`: un avatar cae a sus
 *    iniciales y una portada a su placeholder. Los dos son dibujos correctos y
 *    terminados, no huecos — decir «esto ya no está» sobre la tarjeta de un
 *    álbum sería alarmar sin ofrecer ninguna acción. Y la evidencia de
 *    moderación no la mira un usuario.
 *
 * Sondear lo decorativo tampoco es gratis: cada recurso en `true` gasta
 * presupuesto de la reconciliación, que es una llamada al proveedor por
 * archivo.
 *
 * El `Record` completo obliga a clasificar los recursos nuevos antes de que
 * entren: un miembro más de [ResourceType] no compila hasta que alguien decida
 * de qué lado cae.
 */
exports.MEDIA_AVAILABILITY_BY_RESOURCE = {
    [resource_type_enum_1.ResourceType.AVATAR]: false,
    [resource_type_enum_1.ResourceType.CHAT_GROUP_AVATAR]: false,
    [resource_type_enum_1.ResourceType.ALBUM_COVER]: false,
    // El logo de la marca del album es DECORATIVO y tiene repliegue completo: si
    // no carga, la tarjeta se dibuja sin el y no queda ningun hueco que explicar
    // ni ningun reintento que cortar. Mismo criterio que la portada y el avatar.
    [resource_type_enum_1.ResourceType.ALBUM_BRANDING_LOGO]: false,
    [resource_type_enum_1.ResourceType.PROFILE_REPORT_SCREENSHOT]: false,
    [resource_type_enum_1.ResourceType.PROFESSIONAL_PHOTO]: true,
    // El video profesional es CONTENIDO, igual que su hermana la foto: vive en
    // una carpeta, se abre en el visor, se descarga y ofrece reintentar. Si el
    // asset muere, ese reintento falla para siempre — que es exactamente el caso
    // para el que existe el canal.
    [resource_type_enum_1.ResourceType.PROFESSIONAL_VIDEO]: true,
    [resource_type_enum_1.ResourceType.GUEST_PHOTO]: true,
    [resource_type_enum_1.ResourceType.GUEST_VIDEO]: true,
    [resource_type_enum_1.ResourceType.CHAT_IMAGE]: true,
    [resource_type_enum_1.ResourceType.CHAT_VIDEO]: true,
    [resource_type_enum_1.ResourceType.CHAT_AUDIO]: true,
    [resource_type_enum_1.ResourceType.CHAT_DOCUMENT]: true,
    [resource_type_enum_1.ResourceType.IMAGE_STORY]: true,
    [resource_type_enum_1.ResourceType.VIDEO_STORY]: true,
};
