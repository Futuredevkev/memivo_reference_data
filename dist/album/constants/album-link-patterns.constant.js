"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALBUM_INVITE_URL_PATTERN = exports.ALBUM_JOIN_URL_PATTERN = void 0;
const album_link_paths_constant_1 = require("./album-link-paths.constant");
/**
 * Los patrones con los que el consumidor re-clasifica una URL acuñada por el
 * API. Se derivan de los mismos segmentos que la construyen: si el segmento
 * cambia, el parser cambia con él en vez de quedar desfasado en silencio.
 */
exports.ALBUM_JOIN_URL_PATTERN = new RegExp(`/${album_link_paths_constant_1.ALBUM_JOIN_PATH_SEGMENT}/([^/?#]+)`);
exports.ALBUM_INVITE_URL_PATTERN = new RegExp(`/${album_link_paths_constant_1.ALBUM_INVITE_PATH_SEGMENT}/([^/?#]+)`);
