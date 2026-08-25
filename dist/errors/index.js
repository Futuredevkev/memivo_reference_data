"use strict";
/**
 * Barrel export para todos los códigos de error
 * Permite importar desde un solo lugar manteniendo la organización modular
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickerErrorCode = exports.OAuthErrorCode = exports.LikeErrorCode = exports.DownloadErrorCode = exports.UploadErrorCode = exports.BlockErrorCode = exports.ModerationErrorCode = exports.ReportErrorCode = exports.StoryCommentErrorCode = exports.StoryErrorCode = exports.ReactionErrorCode = exports.MailErrorCode = exports.CommentErrorCode = exports.PollErrorCode = exports.ChatErrorCode = exports.PhotoErrorCode = exports.FolderErrorCode = exports.AlbumErrorCode = exports.UserErrorCode = exports.AuthErrorCode = exports.CommonErrorCode = void 0;
const common_error_code_1 = require("./common.error-code");
Object.defineProperty(exports, "CommonErrorCode", { enumerable: true, get: function () { return common_error_code_1.CommonErrorCode; } });
const auth_error_code_1 = require("./auth.error-code");
Object.defineProperty(exports, "AuthErrorCode", { enumerable: true, get: function () { return auth_error_code_1.AuthErrorCode; } });
const user_error_code_1 = require("./user.error-code");
Object.defineProperty(exports, "UserErrorCode", { enumerable: true, get: function () { return user_error_code_1.UserErrorCode; } });
const album_error_code_1 = require("./album.error-code");
Object.defineProperty(exports, "AlbumErrorCode", { enumerable: true, get: function () { return album_error_code_1.AlbumErrorCode; } });
const folder_error_code_1 = require("./folder.error-code");
Object.defineProperty(exports, "FolderErrorCode", { enumerable: true, get: function () { return folder_error_code_1.FolderErrorCode; } });
const photo_error_code_1 = require("./photo.error-code");
Object.defineProperty(exports, "PhotoErrorCode", { enumerable: true, get: function () { return photo_error_code_1.PhotoErrorCode; } });
const chat_error_code_1 = require("./chat.error-code");
Object.defineProperty(exports, "ChatErrorCode", { enumerable: true, get: function () { return chat_error_code_1.ChatErrorCode; } });
const poll_error_code_1 = require("./poll.error-code");
Object.defineProperty(exports, "PollErrorCode", { enumerable: true, get: function () { return poll_error_code_1.PollErrorCode; } });
const comment_error_code_1 = require("./comment.error-code");
Object.defineProperty(exports, "CommentErrorCode", { enumerable: true, get: function () { return comment_error_code_1.CommentErrorCode; } });
const mail_error_code_1 = require("./mail.error-code");
Object.defineProperty(exports, "MailErrorCode", { enumerable: true, get: function () { return mail_error_code_1.MailErrorCode; } });
const reaction_error_code_1 = require("./reaction.error-code");
Object.defineProperty(exports, "ReactionErrorCode", { enumerable: true, get: function () { return reaction_error_code_1.ReactionErrorCode; } });
const story_error_code_1 = require("./story.error-code");
Object.defineProperty(exports, "StoryErrorCode", { enumerable: true, get: function () { return story_error_code_1.StoryErrorCode; } });
const story_comment_error_code_1 = require("./story-comment.error-code");
Object.defineProperty(exports, "StoryCommentErrorCode", { enumerable: true, get: function () { return story_comment_error_code_1.StoryCommentErrorCode; } });
const report_error_code_1 = require("./report.error-code");
Object.defineProperty(exports, "ReportErrorCode", { enumerable: true, get: function () { return report_error_code_1.ReportErrorCode; } });
const moderation_error_code_1 = require("./moderation.error-code");
Object.defineProperty(exports, "ModerationErrorCode", { enumerable: true, get: function () { return moderation_error_code_1.ModerationErrorCode; } });
const block_error_code_1 = require("./block.error-code");
Object.defineProperty(exports, "BlockErrorCode", { enumerable: true, get: function () { return block_error_code_1.BlockErrorCode; } });
const upload_error_code_1 = require("./upload.error-code");
Object.defineProperty(exports, "UploadErrorCode", { enumerable: true, get: function () { return upload_error_code_1.UploadErrorCode; } });
const download_error_code_1 = require("./download.error-code");
Object.defineProperty(exports, "DownloadErrorCode", { enumerable: true, get: function () { return download_error_code_1.DownloadErrorCode; } });
const like_error_code_1 = require("./like.error-code");
Object.defineProperty(exports, "LikeErrorCode", { enumerable: true, get: function () { return like_error_code_1.LikeErrorCode; } });
const oauth_error_code_1 = require("./oauth.error-code");
Object.defineProperty(exports, "OAuthErrorCode", { enumerable: true, get: function () { return oauth_error_code_1.OAuthErrorCode; } });
const sticker_error_code_1 = require("./sticker.error-code");
Object.defineProperty(exports, "StickerErrorCode", { enumerable: true, get: function () { return sticker_error_code_1.StickerErrorCode; } });
__exportStar(require("./error-code.constant"), exports);
__exportStar(require("./api-error-envelope.interface"), exports);
__exportStar(require("./api-success-envelope.interface"), exports);
__exportStar(require("./reserved-error-body-keys.constant"), exports);
__exportStar(require("./forwardable-error-fields.type"), exports);
