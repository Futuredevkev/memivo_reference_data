"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumWriteSurface = void 0;
/**
 * Cada forma en que alguien deja algo NUEVO adentro de un álbum.
 *
 * ── PARA QUÉ EXISTE: PARA QUE LA SUPERFICIE N+1 NO COMPILE ────────────────
 * El interruptor de publicación corta unas y no otras, y esa elección se
 * escribe como tabla exhaustiva —[ALBUM_POSTING_GATED_WRITE_SURFACES]— y no
 * como una lista de excepciones en un `if`. La diferencia es que la lista no
 * tiene gate: el día que aparezca una superficie nueva, entra en silencio al
 * comportamiento viejo, que es justamente la decisión que había que tomar a
 * conciencia. Con el `Record` completo, `tsc` la pide.
 *
 * ── QUÉ NO ESTÁ ACÁ, Y POR QUÉ NO ES UN OLVIDO ────────────────────────────
 * Las carpetas y la foto profesional escriben en el álbum y NO son miembros:
 * las dos ya pasan por su propio gate de gestión —sólo las toca quien
 * organiza—, así que agregarlas a esta tabla no cambiaría ninguna decisión y
 * sí crearía una segunda puerta para la misma autorización. Un miembro nuevo
 * acá se justifica cuando la superficie hoy la puede usar cualquier miembro.
 *
 * El eje de los nombres es LA PIEZA que nace, no la ruta que la crea: el post
 * de texto y el post con media son la misma superficie por dos caminos, y
 * separarlos dejaría dos entradas que nadie puede contestar distinto.
 */
var AlbumWriteSurface;
(function (AlbumWriteSurface) {
    /** Un post en el feed, con texto o con media. */
    AlbumWriteSurface["GUEST_POST"] = "GUEST_POST";
    /** Una historia. */
    AlbumWriteSurface["STORY"] = "STORY";
    /** Un comentario sobre un post. */
    AlbumWriteSurface["COMMENT"] = "COMMENT";
    /** Una respuesta a un comentario. */
    AlbumWriteSurface["RESPONSE"] = "RESPONSE";
    /** Un comentario sobre una historia. */
    AlbumWriteSurface["STORY_COMMENT"] = "STORY_COMMENT";
    /** Un voto en la encuesta de una historia. */
    AlbumWriteSurface["STORY_POLL_VOTE"] = "STORY_POLL_VOTE";
    /** Un «me gusta» sobre un post. */
    AlbumWriteSurface["LIKE"] = "LIKE";
    /** Una reacción sobre un comentario o una respuesta. */
    AlbumWriteSurface["REACTION"] = "REACTION";
    /** Etiquetar a alguien en una foto. */
    AlbumWriteSurface["PHOTO_TAG"] = "PHOTO_TAG";
    /** Un mensaje en el chat del álbum. */
    AlbumWriteSurface["CHAT_MESSAGE"] = "CHAT_MESSAGE";
})(AlbumWriteSurface || (exports.AlbumWriteSurface = AlbumWriteSurface = {}));
