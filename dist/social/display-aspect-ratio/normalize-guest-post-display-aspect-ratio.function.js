"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeGuestPostDisplayAspectRatio = void 0;
const default_guest_post_display_aspect_ratio_constant_1 = require("./default-guest-post-display-aspect-ratio.constant");
const guest_post_display_aspect_ratio_presets_constant_1 = require("./guest-post-display-aspect-ratio-presets.constant");
/**
 * Ajusta un aspect ratio arbitrario al preset más cercano. Entrada inválida
 * (no numérica, NaN, no finita o <= 0) cae al default (cuadrado). Es la ÚNICA
 * fuente de verdad del snap; API y cliente la importan para no divergir.
 */
const normalizeGuestPostDisplayAspectRatio = (aspectRatio) => {
    if (typeof aspectRatio !== 'number' ||
        Number.isNaN(aspectRatio) ||
        !Number.isFinite(aspectRatio) ||
        aspectRatio <= 0) {
        return default_guest_post_display_aspect_ratio_constant_1.DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO;
    }
    return guest_post_display_aspect_ratio_presets_constant_1.GUEST_POST_DISPLAY_ASPECT_RATIO_PRESETS.reduce((closest, preset) => Math.abs(preset - aspectRatio) < Math.abs(closest - aspectRatio)
        ? preset
        : closest, default_guest_post_display_aspect_ratio_constant_1.DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO);
};
exports.normalizeGuestPostDisplayAspectRatio = normalizeGuestPostDisplayAspectRatio;
