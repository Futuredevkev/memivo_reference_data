"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALBUM_ANNOUNCEMENT_WINDOW_HOURS = void 0;
/**
 * EL LARGO, en horas, de la ventana MÓVIL sobre la que se cuenta
 * {@link ALBUM_ANNOUNCEMENT_MAX_PER_WINDOW}.
 *
 * ── POR QUÉ MÓVIL Y NO «POR DÍA CALENDARIO» ──────────────────────────────
 * Un día calendario tiene un borde a medianoche, y la medianoche de un evento
 * es justo cuando la fiesta sigue: con borde fijo, seis avisos a las 23:30 y
 * seis más a las 00:05 serían legales. La ventana móvil cuenta las últimas 24
 * horas desde AHORA, y no depende de la zona horaria de nadie.
 *
 * ── POR QUÉ 24 ────────────────────────────────────────────────────────────
 * Es el largo de un evento con su previa y su cola. Lo que se protege es el
 * teléfono de un invitado a lo largo de un día.
 */
exports.ALBUM_ANNOUNCEMENT_WINDOW_HOURS = 24;
