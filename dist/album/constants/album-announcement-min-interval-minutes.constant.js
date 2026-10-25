"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALBUM_ANNOUNCEMENT_MIN_INTERVAL_MINUTES = void 0;
/**
 * CUÁNTOS MINUTOS tienen que pasar entre dos avisos del MISMO álbum.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 * `NEW_GUEST_POST` se borró el 9 de agosto de 2026 porque avisaba cada
 * publicación y escalaba con la gente. El aviso de quien organiza es una
 * puerta distinta, pero sin intervalo repite ese defecto: dos organizadores
 * que avisan cada uno lo suyo en el mismo minuto son dos push iguales en el
 * teléfono de cada invitado.
 *
 * ── POR QUÉ 30 ────────────────────────────────────────────────────────────
 * Es el ritmo de un evento: entre la ceremonia y la cena, entre la cena y el
 * vals, pasa más de media hora. Más corto deja pasar la ráfaga; más largo
 * frena un aviso que de verdad corre («la torta en 10 minutos»). Es un tope
 * antispam, no de negocio: no depende del plan.
 *
 * El tope es del ÁLBUM, no de la persona: lo que se cuida es el teléfono de
 * quien recibe, que no distingue cuál de los organizadores le avisó.
 */
exports.ALBUM_ANNOUNCEMENT_MIN_INTERVAL_MINUTES = 30;
