/**
 * QUÉ lleva adentro un mensaje además de su texto, y por lo tanto qué hay que
 * volver a autorizar cuando ese mensaje entra a otro chat.
 *
 * El permiso que puso un mensaje en el chat A no viaja con él: mudarlo al chat
 * B es una entrada nueva y se autoriza de nuevo, en el destino. Este enum es lo
 * que hace que esa re-autorización sea exhaustiva — quien agregue un tipo de
 * mensaje tiene que declarar qué carga, y quien agregue una carga nueva rompe
 * el `Record` que decide cómo se readmite cada una.
 */
export declare enum ChatContentPayload {
    /** Sólo texto propio. No hay nada más que autorizar en el destino. */
    NONE = "NONE",
    /** Archivos subidos al chat. Se referencian: el asset no se duplica. */
    FILES = "FILES",
    /** Un post del álbum. En el destino se vuelve a resolver a qué álbum
     *  pertenece y si hay bloqueo con su autor. */
    SHARED_POST = "SHARED_POST",
    /**
     * Un sticker de un catálogo EXTERNO.
     *
     * Es su propia carga y no `FILES`, y la diferencia es de dueño: un archivo
     * del chat lo subió alguien y vive en nuestro almacenamiento, con su cuota y
     * su borrado; un sticker es una REFERENCIA a un asset ajeno que nadie subió
     * y que no ocupa nada nuestro. Meterlo en `FILES` lo habría metido al
     * pipeline de subida, a su validación de MIME y a su tope de tamaño —tres
     * cosas que no aplican— y habría creado una fila de archivo por cada envío
     * del mismo sticker.
     *
     * En el destino no hay nada que volver a autorizar: el catálogo es público y
     * el mismo para todos, así que un sticker que se muda a otro chat no le
     * muestra a nadie algo que no pudiera buscar por su cuenta.
     */
    STICKER = "STICKER"
}
