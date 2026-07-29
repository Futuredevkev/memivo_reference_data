import {
  ALBUM_INVITE_PATH_SEGMENT,
  ALBUM_JOIN_PATH_SEGMENT,
} from './album-link-paths.constant';

/**
 * Los patrones con los que el consumidor re-clasifica una URL acuñada por el
 * API. Se derivan de los mismos segmentos que la construyen: si el segmento
 * cambia, el parser cambia con él en vez de quedar desfasado en silencio.
 */
export const ALBUM_JOIN_URL_PATTERN = new RegExp(
  `/${ALBUM_JOIN_PATH_SEGMENT}/([^/?#]+)`,
);
export const ALBUM_INVITE_URL_PATTERN = new RegExp(
  `/${ALBUM_INVITE_PATH_SEGMENT}/([^/?#]+)`,
);
