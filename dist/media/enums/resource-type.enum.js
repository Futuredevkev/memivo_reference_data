"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceType = void 0;
var ResourceType;
(function (ResourceType) {
    ResourceType["AVATAR"] = "avatar";
    ResourceType["CHAT_GROUP_AVATAR"] = "chat_group_avatar";
    ResourceType["ALBUM_COVER"] = "album_cover";
    ResourceType["PROFESSIONAL_PHOTO"] = "professional_photo";
    /**
     * El VIDEO que el organizador entrega dentro de una carpeta, al lado de sus
     * fotos.
     *
     * ── POR QUÉ ES UN `ResourceType` NUEVO Y NO UN `PhotoType` NUEVO ────────
     * Son dos ejes distintos y la ola los separó a propósito. `PhotoType` dice
     * DE QUIÉN es la pieza —profesional o de invitado— y de ahí cuelga el
     * invariante «pieza profesional ⟺ vive en una carpeta», escrito como CHECK
     * bidireccional en la base. Un `PhotoType.PROFESSIONAL_VIDEO` habría caído
     * del lado equivocado de ese CHECK: le PROHIBIRÍA tener carpeta, y con eso
     * el video se caería de la descarga masiva, de la portada de carpeta, del
     * contador de la carpeta y del cupo del álbum — cuatro dominios que hoy
     * preguntan por el tipo de foto.
     *
     * `ResourceType` dice QUÉ ES el archivo, y ése es el eje que cambia: el
     * pipeline por el que sube, con qué se entrega, cómo se lo mide y con qué
     * `resource_type` se lo borra. Las cinco tablas totales del enum obligan a
     * contestar esas cinco preguntas, que es exactamente lo que hacía falta.
     *
     * ── LO QUE ESTO IMPLICA, DICHO ─────────────────────────────────────────
     * El video profesional ES una fila `photos` con `type = PROFESSIONAL`, así
     * que entra en carpetas obligatoriamente —no hay «videos sueltos del
     * álbum»—, lo cuenta `Folder.photoCount`, lo cuenta el cupo de piezas
     * profesionales del álbum y lo incluye la descarga masiva. Nada de eso es
     * un efecto lateral no querido: es la decisión.
     */
    ResourceType["PROFESSIONAL_VIDEO"] = "professional_video";
    ResourceType["GUEST_PHOTO"] = "guest_photo";
    ResourceType["GUEST_VIDEO"] = "guest_video";
    ResourceType["CHAT_IMAGE"] = "chat_image";
    ResourceType["CHAT_VIDEO"] = "chat_video";
    ResourceType["CHAT_AUDIO"] = "chat_audio";
    ResourceType["CHAT_DOCUMENT"] = "chat_document";
    ResourceType["IMAGE_STORY"] = "image_story";
    ResourceType["VIDEO_STORY"] = "video_story";
    ResourceType["PROFILE_REPORT_SCREENSHOT"] = "profile_report_screenshot";
    /**
     * El logo con el que un álbum acredita a quien lo entrega.
     *
     * ── POR QUÉ NO REUSA `ALBUM_COVER`, QUE ES LO QUE MÁS SE LE PARECE ─────
     * Comparten peso y formatos, y ahí termina el parecido.
     *
     * 1. **La puerta no lo permite.** `MultipartSizeRejectionInterceptor` recibe
     *    UN `ResourceType` en su constructor, y es de ahí que saca qué recurso
     *    nombrar cuando algo se pasa de tamaño. Con un tipo compartido, el
     *    rechazo de un logo le diría a la persona que se pasó la PORTADA.
     * 2. **La caja no es la misma.** La portada se dimensiona sobre un recuadro
     *    que el cliente ya recortó 1:1 y se abre a pantalla completa; el logo se
     *    dibuja al lado de un nombre, no se recorta, y por eso su bound es mucho
     *    más chico. Un solo tipo obligaría a elegir una caja para los dos, y el
     *    que perdería es el que se carga en cada fila de la lista de álbumes.
     * 3. **La carpeta de Cloudinary es parte del inventario.** Mezclar los dos
     *    deja «cuántos logos hay» sin forma de contestarse desde el proveedor.
     */
    ResourceType["ALBUM_BRANDING_LOGO"] = "album_branding_logo";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
