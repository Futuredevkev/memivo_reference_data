"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
const common_error_code_1 = require("./common.error-code");
const auth_error_code_1 = require("./auth.error-code");
const user_error_code_1 = require("./user.error-code");
const album_error_code_1 = require("./album.error-code");
const folder_error_code_1 = require("./folder.error-code");
const photo_error_code_1 = require("./photo.error-code");
const chat_error_code_1 = require("./chat.error-code");
const poll_error_code_1 = require("./poll.error-code");
const comment_error_code_1 = require("./comment.error-code");
const mail_error_code_1 = require("./mail.error-code");
const reaction_error_code_1 = require("./reaction.error-code");
const story_error_code_1 = require("./story.error-code");
const story_comment_error_code_1 = require("./story-comment.error-code");
const report_error_code_1 = require("./report.error-code");
const moderation_error_code_1 = require("./moderation.error-code");
const block_error_code_1 = require("./block.error-code");
const upload_error_code_1 = require("./upload.error-code");
const download_error_code_1 = require("./download.error-code");
const like_error_code_1 = require("./like.error-code");
const oauth_error_code_1 = require("./oauth.error-code");
/**
 * Enum consolidado para retrocompatibilidad
 * Combina todos los códigos de error en un solo objeto
 *
 * @example
 * import { ErrorCode } from 'src/common/constants/error-codes';
 * throw new BadRequestException({ errorCode: ErrorCode.AUTH_INVALID_CREDENTIALS });
 *
 * Vive acá y NO en el barrel, aunque haga spread de sus 20 hermanos, porque los dos
 * auditores del paquete saltean los `index.ts` a propósito (`isPublicPackageFile` y
 * `exportedSharedSymbols`): un barrel no declara nada propio, así que no hay nada que
 * auditar en él. Éste era el único de los 63 barrels que sí declaraba, y el precio era
 * que `ErrorCodeValue` —superficie pública consumida de verdad por el cliente— quedaba
 * fuera del corpus de duplicados Y del de exports: si un consumidor lo redeclarara
 * localmente, `crossRepoRisks` no lo vería; si dejara de usarse, `unusedSharedExports`
 * tampoco.
 */
exports.ErrorCode = {
    // Common
    ...common_error_code_1.CommonErrorCode,
    // Auth
    ...auth_error_code_1.AuthErrorCode,
    // User
    ...user_error_code_1.UserErrorCode,
    // Album
    ...album_error_code_1.AlbumErrorCode,
    // Folder
    ...folder_error_code_1.FolderErrorCode,
    // Photo
    ...photo_error_code_1.PhotoErrorCode,
    // Chat
    ...chat_error_code_1.ChatErrorCode,
    // Poll
    ...poll_error_code_1.PollErrorCode,
    // Comment
    ...comment_error_code_1.CommentErrorCode,
    // Mail
    ...mail_error_code_1.MailErrorCode,
    // Reaction
    ...reaction_error_code_1.ReactionErrorCode,
    // Story
    ...story_error_code_1.StoryErrorCode,
    // StoryComment
    ...story_comment_error_code_1.StoryCommentErrorCode,
    // Report
    ...report_error_code_1.ReportErrorCode,
    // Moderation
    ...moderation_error_code_1.ModerationErrorCode,
    // Block
    ...block_error_code_1.BlockErrorCode,
    // Upload
    ...upload_error_code_1.UploadErrorCode,
    // Download
    ...download_error_code_1.DownloadErrorCode,
    // Like
    ...like_error_code_1.LikeErrorCode,
    // OAuth
    ...oauth_error_code_1.OAuthErrorCode,
};
