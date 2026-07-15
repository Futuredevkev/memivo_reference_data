import { GUEST_POST_LANDSCAPE_DISPLAY_ASPECT_RATIO } from './guest-post-landscape-display-aspect-ratio.constant';
import { GUEST_POST_PORTRAIT_DISPLAY_ASPECT_RATIO } from './guest-post-portrait-display-aspect-ratio.constant';
import { GUEST_POST_SQUARE_DISPLAY_ASPECT_RATIO } from './guest-post-square-display-aspect-ratio.constant';

export const GUEST_POST_DISPLAY_ASPECT_RATIO_PRESETS = [
  GUEST_POST_PORTRAIT_DISPLAY_ASPECT_RATIO,
  GUEST_POST_SQUARE_DISPLAY_ASPECT_RATIO,
  GUEST_POST_LANDSCAPE_DISPLAY_ASPECT_RATIO,
] as const;
