import { DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO } from './default-guest-post-display-aspect-ratio.constant';
import { GUEST_POST_DISPLAY_ASPECT_RATIO_PRESETS } from './guest-post-display-aspect-ratio-presets.constant';

/**
 * Ajusta un aspect ratio arbitrario al preset más cercano. Entrada inválida
 * (no numérica, NaN, no finita o <= 0) cae al default (cuadrado). Es la ÚNICA
 * fuente de verdad del snap; API y cliente la importan para no divergir.
 */
export const normalizeGuestPostDisplayAspectRatio = (
  aspectRatio?: number | null,
): number => {
  if (
    typeof aspectRatio !== 'number' ||
    Number.isNaN(aspectRatio) ||
    !Number.isFinite(aspectRatio) ||
    aspectRatio <= 0
  ) {
    return DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO;
  }

  return GUEST_POST_DISPLAY_ASPECT_RATIO_PRESETS.reduce(
    (closest, preset) =>
      Math.abs(preset - aspectRatio) < Math.abs(closest - aspectRatio)
        ? preset
        : closest,
    DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO,
  );
};
