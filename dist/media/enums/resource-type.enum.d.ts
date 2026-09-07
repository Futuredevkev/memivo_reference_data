export declare enum ResourceType {
    AVATAR = "avatar",
    CHAT_GROUP_AVATAR = "chat_group_avatar",
    ALBUM_COVER = "album_cover",
    PROFESSIONAL_PHOTO = "professional_photo",
    GUEST_PHOTO = "guest_photo",
    GUEST_VIDEO = "guest_video",
    CHAT_IMAGE = "chat_image",
    CHAT_VIDEO = "chat_video",
    CHAT_AUDIO = "chat_audio",
    CHAT_DOCUMENT = "chat_document",
    IMAGE_STORY = "image_story",
    VIDEO_STORY = "video_story",
    PROFILE_REPORT_SCREENSHOT = "profile_report_screenshot",
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
    ALBUM_BRANDING_LOGO = "album_branding_logo"
}
