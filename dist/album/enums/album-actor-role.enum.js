"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumActorRole = void 0;
var AlbumActorRole;
(function (AlbumActorRole) {
    AlbumActorRole["OWNER"] = "OWNER";
    AlbumActorRole["ORGANIZER"] = "ORGANIZER";
    /**
     * Memivo actuando por su propia autoridad, sin ninguna persona detrás.
     *
     * ── POR QUÉ HACÍA FALTA UN TERCER VALOR ────────────────────────────────
     * El rol del audit-log del álbum se deriva de `album.creatorId === actor`, o
     * sea que con dos valores TODO actor que no fuera el creador quedaba escrito
     * como `ORGANIZER`. Cuando la plataforma remueve una pieza por un reclamo de
     * un tercero, esa fila afirmaría que lo hizo un organizador del álbum —una
     * mentira, en la única tabla del repo que se declara append-only y forense, y
     * encima una que le echa la culpa a un vecino que no hizo nada.
     *
     * Es el rol que acompaña a `actorUserId` nulo: la columna ya admitía el null
     * y su comentario lo reservaba para un actor de sistema, pero sin un rol que
     * lo nombrara la reserva era inejecutable, no sólo inejercida.
     *
     * Y no lleva nombre de empleado a propósito: un álbum privado no tiene por
     * qué enterarse de qué persona de Memivo ejecutó la acción.
     */
    AlbumActorRole["PLATFORM"] = "PLATFORM";
})(AlbumActorRole || (exports.AlbumActorRole = AlbumActorRole = {}));
