/**
 * Las piezas que el vocabulario de MODERACIÓN sabe nombrar.
 *
 * No es «todo lo que se puede publicar»: es lo que un camino de moderación
 * —el del organizador del álbum o el de la plataforma— sabe identificar,
 * registrar en el expediente y nombrarle al autor en el aviso.
 */
export declare enum ModeratedContentType {
    POST = "POST",
    /**
     * Cualquier foto del álbum: la de un invitado y la PROFESIONAL que sube
     * quien organiza dentro de una carpeta.
     *
     * ── POR QUÉ ESTE DOCBLOCK CAMBIÓ, Y QUÉ DECÍA ANTES ───────────────────────
     * Hasta la ola N3 este miembro nombraba SÓLO la foto de un invitado, y el
     * docblock lo declaraba: la remoción de plataforma filtraba por
     * `PhotoType.GUEST` y contestaba «existe pero este camino no la sabe
     * remover» sobre una foto profesional publicada. Eso ya no es verdad y el
     * errorCode que lo decía **se borró del catálogo**, porque al levantarse la
     * restricción se quedó sin un solo emisor y ORDEN §7 no admite superficie
     * publicada que nadie produzca.
     *
     * ── POR QUÉ SE LEVANTÓ ────────────────────────────────────────────────────
     * El dueño lo decidió el 31 de agosto de 2026, y el argumento es de alcance,
     * no de autoría: **la foto profesional la ve el álbum entero**. Contenido
     * explícito subido por quien organiza merece bajarse sin importar quién lo
     * subió, porque quien organiza responde por lo que administra. Los términos
     * §10.1 ya prometían la remoción como una de las tres salidas de un reclamo
     * válido; lo que faltaba era que este camino pudiera ejecutarla.
     *
     * ── QUÉ NO CAMBIÓ ─────────────────────────────────────────────────────────
     * El borrado de una foto profesional POR SU ORGANIZADOR sigue teniendo su
     * propio camino y su propia acción en el registro del álbum. Lo que este
     * miembro nombra es la pieza, no el camino que la baja.
     */
    PHOTO = "PHOTO",
    COMMENT = "COMMENT",
    REPLY = "REPLY",
    STORY = "STORY",
    STORY_COMMENT = "STORY_COMMENT",
    /**
     * Un mensaje de un chat del álbum.
     *
     * ── EL HUECO QUE CIERRA ──────────────────────────────────────────────────
     * Los participantes abren sus propios chats dentro de un álbum, y ésos el
     * organizador NO los administra ni los lee. Eso dejaba un abuso sin nadie que
     * lo atendiera: se podía denunciar a la PERSONA desde su perfil —tres
     * pantallas más allá, y sin decir qué mandó—, pero no al mensaje, así que la
     * denuncia llegaba sin la pieza, que es lo único que la vuelve accionable.
     *
     * ── POR QUÉ NO LO REMUEVE UN ORGANIZADOR ─────────────────────────────────
     * Porque no le toca: el chat que no administra tampoco lo modera. Esta clase
     * la baja SÓLO la plataforma, y por eso su remoción NO se escribe en el
     * registro de acciones del álbum —que el organizador sí lee—: contarle ahí
     * que en una sala donde no está se removió algo delata la sala. El hecho
     * queda entero en el expediente de moderación, que es donde corresponde.
     *
     * ── LO QUE ESTE PUNTERO NO GARANTIZA, DICHO ──────────────────────────────
     * Que el MEDIO siga existiendo. Un mensaje de una sola vez borra sus archivos
     * al cerrarse el visor, así que una denuncia hecha DESPUÉS señala una fila que
     * ya no tiene qué mostrar. Se apunta igual —prueba quién mandó qué clase de
     * cosa y cuándo— y quien denuncia puede adjuntar capturas.
     *
     * Las dos mitades que faltaban cuando esto se escribió se pagaron en la misma
     * línea versionada: el reporte congela el texto y RETIENE los archivos contra
     * el borrado, y la app dejó de ofrecer esa denuncia tardía —una pieza de una
     * sola vez se denuncia desde SU visor, con el archivo todavía vivo—. Queda sin
     * remedio lo que un cliente viejo o un pedido armado a mano todavía pueden
     * producir: el puntero a una pieza que se quemó antes de existir el reporte.
     */
    CHAT_MESSAGE = "CHAT_MESSAGE"
}
