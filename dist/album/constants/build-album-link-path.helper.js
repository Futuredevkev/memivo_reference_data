"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAlbumInvitePath = exports.buildAlbumJoinPath = void 0;
const album_link_paths_constant_1 = require("./album-link-paths.constant");
/** `/join/<qrCode>` — el link canónico del álbum (QR y «compartir»). */
const buildAlbumJoinPath = (qrCode) => `/${album_link_paths_constant_1.ALBUM_JOIN_PATH_SEGMENT}/${qrCode}`;
exports.buildAlbumJoinPath = buildAlbumJoinPath;
/** `/invite/<token>` — el link de invitación de un álbum o de un post. */
const buildAlbumInvitePath = (token) => `/${album_link_paths_constant_1.ALBUM_INVITE_PATH_SEGMENT}/${token}`;
exports.buildAlbumInvitePath = buildAlbumInvitePath;
