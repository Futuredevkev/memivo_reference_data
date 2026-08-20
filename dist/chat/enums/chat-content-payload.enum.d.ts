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
    SHARED_POST = "SHARED_POST"
}
