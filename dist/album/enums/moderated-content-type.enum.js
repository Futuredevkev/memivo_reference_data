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
     * La foto de un INVITADO, no cualquier foto.
     *
     * ── POR QUÉ ESTÁ ESCRITO, y desde cuándo es verdad ────────────────────────
     * Siempre significó eso, y nunca lo decía. Los dos únicos lugares del árbol
     * que producen este miembro trabajan sobre fotos de invitado: la moderación
     * del organizador (`deleteGuestPhotos`, que además firma la fila como
     * `GUEST_PHOTOS_DELETED`) y la remoción de plataforma, cuyo buscador filtra
     * por `PhotoType.GUEST`. Las fotos PROFESSIONAL —las que sube quien organiza,
     * dentro de una carpeta— se borran por su propio camino
     * (`OrganizerPhotoService.deletePhotos`, que registra `PHOTO_DELETED`) y
     * nunca pasaron por este enum.
     *
     * El día que faltó esta línea, la remoción de plataforma contestó
     * `MODERATED_CONTENT_NOT_FOUND` —«no existe»— sobre una foto profesional que
     * estaba publicada, y eso manda al moderador a revisar un id que estaba bien.
     * Hoy contesta `MODERATED_CONTENT_TYPE_NOT_REMOVABLE`, que nombra la causa.
     *
     * ── QUÉ PASA CON UN RECLAMO SOBRE UNA FOTO PROFESIONAL ────────────────────
     * Los términos §10.1 no prometen una sola salida: prometen que, **según el
     * caso**, Memivo avisa a quien administra el álbum para que retire el
     * material, lo remueve, o suspende la cuenta. Para una foto profesional las
     * otras dos siguen disponibles, así que la promesa se cumple — lo que no
     * puede es cumplirse contestando «no existe».
     */
    ModeratedContentType["PHOTO"] = "PHOTO";
    ModeratedContentType["COMMENT"] = "COMMENT";
    ModeratedContentType["REPLY"] = "REPLY";
    ModeratedContentType["STORY"] = "STORY";
    ModeratedContentType["STORY_COMMENT"] = "STORY_COMMENT";
})(ModeratedContentType || (exports.ModeratedContentType = ModeratedContentType = {}));
