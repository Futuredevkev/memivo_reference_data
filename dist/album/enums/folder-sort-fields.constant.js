"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLDER_SORT_FIELDS = void 0;
/**
 * Las columnas por las que se puede ordenar la lista de carpetas de un álbum.
 *
 * `created_at` es el orden de siempre (nuevas o viejas primero). `name` existe
 * porque los fotógrafos numeran las carpetas por momento del evento
 * («1. Ceremonia», «2. Fiesta»): el servidor lo ordena con orden NATURAL, así
 * que «10» va después de «9» y no después de «1».
 */
exports.FOLDER_SORT_FIELDS = ['created_at', 'name'];
