"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMIVO_MIN_MOMENTS = void 0;
/**
 * Momentos activos mínimos para avisar por push y para mostrar el banner.
 *
 * Vive en el contrato porque es UN enunciado de producto consumido por los dos
 * lados: el backend decide con él si notifica y el cliente si muestra el banner.
 * Duplicarlo por repo permitiría que un álbum notifique lo que la app no muestra.
 */
exports.MEMIVO_MIN_MOMENTS = 2;
