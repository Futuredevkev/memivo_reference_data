import type { MEDIA_COMPOSITION_VERSION } from '../constants';
import type { MediaCompositionBackground, MediaCompositionMode } from '../types';

export interface MediaComposition {
  version: typeof MEDIA_COMPOSITION_VERSION;
  mode: MediaCompositionMode;
  background: MediaCompositionBackground;
  scale: number;
  offsetX: number;
  offsetY: number;
}
