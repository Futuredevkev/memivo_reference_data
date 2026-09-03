"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOWNLOAD_JOB_MAX_ACTIVE_PER_USER = void 0;
/**
 * Cuántos trabajos de descarga puede tener EN CURSO una misma persona.
 *
 * Acota las filas y los manifests que una sola cuenta puede tener vivos a la
 * vez. Sube al paquete porque el rechazo decía «Tenés demasiadas descargas
 * activas» sin decir cuántas se permiten, que es justamente el dato con el que
 * quien lo lee sabe si le falta esperar una o tres.
 *
 * El nombre empieza por el sujeto —`DOWNLOAD_JOB_…`— como sus hermanas de esta
 * carpeta, y no por el adjetivo como en el api, para que las tres se lean
 * juntas en el barril.
 */
exports.DOWNLOAD_JOB_MAX_ACTIVE_PER_USER = 3;
