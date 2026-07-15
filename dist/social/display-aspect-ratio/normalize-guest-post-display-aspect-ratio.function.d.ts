/**
 * Ajusta un aspect ratio arbitrario al preset más cercano. Entrada inválida
 * (no numérica, NaN, no finita o <= 0) cae al default (cuadrado). Es la ÚNICA
 * fuente de verdad del snap; API y cliente la importan para no divergir.
 */
export declare const normalizeGuestPostDisplayAspectRatio: (aspectRatio?: number | null) => number;
