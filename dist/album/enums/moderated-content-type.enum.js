"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratedContentType = void 0;
/**
 * Las piezas que el vocabulario de MODERACIÓN sabe nombrar.
 *
 * No es «todo lo que se puede publicar»: es lo que un camino de moderación
 * —el del organizador del álbum o el de la plataforma— sabe identificar,
 * registrar en el expediente y nombrarle al autor en el aviso.
 */
var ModeratedContentType;
(function (ModeratedContentType) {
    ModeratedContentType["POST"] = "POST";
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
    ModeratedContentType["PHOTO"] = "PHOTO";
    ModeratedContentType["COMMENT"] = "COMMENT";
    ModeratedContentType["REPLY"] = "REPLY";
    ModeratedContentType["STORY"] = "STORY";
    ModeratedContentType["STORY_COMMENT"] = "STORY_COMMENT";
})(ModeratedContentType || (exports.ModeratedContentType = ModeratedContentType = {}));
