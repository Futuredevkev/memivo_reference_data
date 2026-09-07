"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOWNLOAD_QUOTA_WINDOW_DAYS = void 0;
/**
 * El ancho de la ventana sobre la que se mide cuánto bajó una persona.
 *
 * ── POR QUÉ RODANTE Y NO UN CICLO FIJO ─────────────────────────────────────
 * Un ciclo fijo —«se resetea el 1º»— regala un pico gratis en el borde: el 31 y
 * el 1º son dos cuotas enteras seguidas, y ése es justo el día que alguien que
 * quiere abusar elige. Con ventana rodante no hay borde que esperar.
 *
 * ── POR QUÉ 30 DÍAS ────────────────────────────────────────────────────────
 * Porque es el plazo en el que se consume una entrega: el organizador sube
 * durante las semanas siguientes al evento y la gente baja a medida que
 * aparecen las fotos. Una ventana más corta cortaría a mitad de una entrega
 * real; una más larga tardaría un trimestre en perdonar un pico legítimo.
 * Coincide con el plazo con el que nace un código QR sin plan, y no es
 * casualidad: los dos miden lo que dura un evento y su cola.
 */
exports.DOWNLOAD_QUOTA_WINDOW_DAYS = 30;
