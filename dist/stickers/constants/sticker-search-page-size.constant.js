"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STICKER_SEARCH_PAGE_SIZE = void 0;
/**
 * Cuántos stickers trae una página del selector.
 *
 * Lo fija el SERVIDOR y no viaja en la request: un cliente que pidiera diez mil
 * quemaría la cuota de la clave —que es por hora y compartida por toda la app—
 * para todos los demás.
 *
 * Veinticuatro es lo que llena tres pantallas de una grilla de cuatro columnas
 * sin que la primera carga tenga que traer de más.
 */
exports.STICKER_SEARCH_PAGE_SIZE = 24;
