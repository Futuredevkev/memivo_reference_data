import { STICKER_QUERY_MAX_LENGTH } from '../constants';

/**
 * EL DUEÑO de la identidad de un término del catálogo.
 *
 * La app usa el término como clave local y el servidor como clave compartida.
 * Con sólo `trim`, cambiar mayúsculas o repetir un espacio abría dos entradas en
 * el teléfono para una sola entrada del servidor: la grilla se vaciaba y volvía
 * a pedir un resultado que ya tenía. Compartir la función impide que esas dos
 * definiciones vuelvan a divergir.
 *
 * Baja a minúsculas SIN depender del locale del dispositivo, recorta los
 * bordes, colapsa el espacio interno y aplica el mismo tope que el borde. Usar
 * el locale implícito permitiría que el mismo texto tuviera otra clave en un
 * teléfono y en el servidor. No elimina acentos: cambiar letras cambia la
 * búsqueda que la persona hizo.
 */
export const normalizeStickerQuery = (query: string): string =>
  query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, STICKER_QUERY_MAX_LENGTH);
