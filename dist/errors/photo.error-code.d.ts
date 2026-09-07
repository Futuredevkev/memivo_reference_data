/**
 * Códigos de error del módulo de fotos y uploads
 */
export declare enum PhotoErrorCode {
    PHOTO_NOT_FOUND = "PHOTO_NOT_FOUND",
    GUEST_POST_NOT_FOUND = "GUEST_POST_NOT_FOUND",
    GUEST_POST_EMPTY = "GUEST_POST_EMPTY",
    /** Editar una publicación ajena. Usaba `PHOTO_DELETE_FORBIDDEN`, cuya copia
     * habla de BORRAR fotos: el único caller es el PATCH de edición. */
    GUEST_POST_EDIT_FORBIDDEN = "GUEST_POST_EDIT_FORBIDDEN",
    GUEST_VIDEO_TOO_LONG = "GUEST_VIDEO_TOO_LONG",
    /**
     * El video PROFESIONAL se pasó del plazo que su fila del catálogo declara.
     *
     * ── POR QUÉ TIENE CÓDIGO PROPIO Y NO REUSA EL DEL INVITADO ─────────────
     * Porque los dos plazos son distintos y la frase dice el número: reusar el
     * código dejaría al organizador leyendo el tope del invitado. Es la misma
     * razón por la que ya hay cuatro `…_TOO_LONG` y no uno, y lo sostiene un
     * gate del api que cruza los tipos con tope contra este mapa.
     *
     * El sufijo `_TOO_LONG` no es estético: es lo que hace que el cliente lo
     * clasifique como regla con número y busque su fila en la tabla de copias.
     */
    PROFESSIONAL_VIDEO_TOO_LONG = "PROFESSIONAL_VIDEO_TOO_LONG",
    PHOTO_TAG_ALREADY_EXISTS = "PHOTO_TAG_ALREADY_EXISTS",
    PHOTO_TAG_FORBIDDEN = "PHOTO_TAG_FORBIDDEN",
    PHOTO_TAG_NOT_GUEST_PHOTO = "PHOTO_TAG_NOT_GUEST_PHOTO",
    PHOTO_TAG_NOT_FOUND = "PHOTO_TAG_NOT_FOUND",
    /**
     * La publicación llegó al tope de personas etiquetadas.
     *
     * El tope existía y sólo lo aplicaba UNA de las dos puertas: el `finalize`
     * de la subida lo capaba con `@ArrayMaxSize`, y `POST /photos/:id/tags`
     * —que etiqueta una foto YA PUBLICADA— no contaba nada. La app decía
     * «Podés etiquetar hasta 50» al crear el post y, sobre el MISMO post ya
     * publicado, dejaba etiquetar sin freno hasta agotar la lista de miembros,
     * cada etiqueta con su notificación y su push. La regla que la app anuncia
     * tiene que ser la regla que el sistema aplica.
     */
    PHOTO_TAG_LIMIT_REACHED = "PHOTO_TAG_LIMIT_REACHED",
    UPLOAD_ALL_FAILED = "UPLOAD_ALL_FAILED",
    UPLOAD_ALBUM_MISMATCH = "UPLOAD_ALBUM_MISMATCH",
    IMAGE_NOT_FOUND = "IMAGE_NOT_FOUND"
}
