"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_POST_TAGS_MAX_ITEMS = void 0;
/**
 * Cuántas personas se pueden etiquetar en UNA publicación, sumando TODAS sus
 * fotos.
 *
 * Decide cuántas deja agregar la app Y cuántas acepta el finalize, igual que su
 * hermano `MULTI_FILE_UPLOAD_LIMIT` y por la misma razón: si los dos números
 * divergen, la persona etiqueta N, espera la subida completa de hasta diez
 * archivos y recién ahí recibe un 400 — se pierde toda la subida.
 *
 * ── POR QUÉ EL TOPE ES DEL POST Y NO DE CADA FOTO ────────────────────────
 * Porque es la regla que el servidor aplica: el cliente aplana el mapa por foto
 * en UN array y el DTO lo mide entero. Un tope por foto sería un número nuevo
 * que nadie decidió —dividir 50 entre 10 fotos da 5, y cinco etiquetas en una
 * foto sola es un límite que hoy no existe—, así que la app dice la regla que
 * hay, no una inventada para que el eje quede más lindo.
 *
 * ── POR QUÉ 50, Y POR QUÉ NO ES UN TOPE «DEFENSIVO» ─────────────────────
 * Es el número que el servidor viene aplicando. Su docblock anterior lo llamaba
 * un cinturón «si alguien manda un payload absurdo», y era falso contra el
 * cliente que lo alimenta: diez fotos por cinco amigos en cada una dan
 * exactamente 50, y eso no es un payload inventado, es un álbum de casamiento.
 */
exports.GUEST_POST_TAGS_MAX_ITEMS = 50;
