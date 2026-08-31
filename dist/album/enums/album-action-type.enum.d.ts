export declare enum AlbumActionType {
    MEMBER_KICKED = "MEMBER_KICKED",
    ORGANIZER_PROMOTED = "ORGANIZER_PROMOTED",
    ORGANIZER_DEMOTED = "ORGANIZER_DEMOTED",
    GUEST_POST_DELETED = "GUEST_POST_DELETED",
    GUEST_PHOTOS_DELETED = "GUEST_PHOTOS_DELETED",
    PHOTO_DELETED = "PHOTO_DELETED",
    ALL_PHOTOS_DELETED = "ALL_PHOTOS_DELETED",
    FOLDER_DELETED = "FOLDER_DELETED",
    STORY_DELETED = "STORY_DELETED",
    COMMENT_DELETED = "COMMENT_DELETED",
    RESPONSE_DELETED = "RESPONSE_DELETED",
    STORY_COMMENT_DELETED = "STORY_COMMENT_DELETED",
    ALBUM_UPDATED = "ALBUM_UPDATED",
    ALBUM_VISIBILITY_CHANGED = "ALBUM_VISIBILITY_CHANGED",
    /**
     * El dueño rotó el acceso: QR nuevo + invite-links revocados. Deja rastro
     * porque invalida TODOS los links repartidos hasta ese momento — es la acción
     * de álbum con más alcance sobre gente de afuera, y sin registro nadie puede
     * explicar después por qué un link dejó de funcionar.
     */
    ALBUM_ACCESS_RESET = "ALBUM_ACCESS_RESET",
    /**
     * El dueño le corrió el vencimiento al `qrCode` sin rotarlo: el mismo código
     * sigue sirviendo, con más plazo.
     *
     * Queda en el registro por la misma razón que el reset, aunque sea benigna:
     * es la única acción que ALARGA la vida de un código ya repartido, y sin
     * rastro nadie puede explicar después por qué un link que debía haber muerto
     * seguía abierto. El reset cierra puertas; ésta las mantiene abiertas más
     * tiempo, y esa asimetría es justo lo que hay que poder auditar.
     */
    ALBUM_QR_CODE_EXTENDED = "ALBUM_QR_CODE_EXTENDED",
    /** The owner enabled, changed, or removed the album access password. */
    ALBUM_ACCESS_PASSWORD_CHANGED = "ALBUM_ACCESS_PASSWORD_CHANGED",
    ALBUM_COVER_CHANGED = "ALBUM_COVER_CHANGED",
    FOLDER_CREATED = "FOLDER_CREATED",
    FOLDER_RENAMED = "FOLDER_RENAMED",
    FOLDER_COVER_SET = "FOLDER_COVER_SET",
    /**
     * Memivo retiró una pieza del álbum por su propia autoridad: material
     * ilegal, o el derecho de un tercero que no es usuario de Memivo.
     *
     * Tiene acción propia y no se cuelga de `GUEST_POST_DELETED` porque lo que
     * cambia no es QUÉ se borró sino QUIÉN lo decidió y con qué potestad, y ése
     * es el dato que el registro de un álbum privado existe para conservar. Con
     * la acción de organizador, la fila diría que la moderación fue del álbum
     * cuando el álbum no tuvo nada que ver — y los miembros no tendrían cómo
     * distinguir un retiro de la plataforma de uno de su propio organizador.
     *
     * Va siempre con `actorUserId` nulo y `AlbumActorRole.PLATFORM`.
     */
    CONTENT_REMOVED_BY_PLATFORM = "CONTENT_REMOVED_BY_PLATFORM"
}
