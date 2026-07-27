import { CommonErrorCode } from './common.error-code';
import { AuthErrorCode } from './auth.error-code';
import { UserErrorCode } from './user.error-code';
import { AlbumErrorCode } from './album.error-code';
import { FolderErrorCode } from './folder.error-code';
import { PhotoErrorCode } from './photo.error-code';
import { ChatErrorCode } from './chat.error-code';
import { PollErrorCode } from './poll.error-code';
import { CommentErrorCode } from './comment.error-code';
import { MailErrorCode } from './mail.error-code';
import { ReactionErrorCode } from './reaction.error-code';
import { StoryErrorCode } from './story.error-code';
import { StoryCommentErrorCode } from './story-comment.error-code';
import { ReportErrorCode } from './report.error-code';
import { ModerationErrorCode } from './moderation.error-code';
import { BlockErrorCode } from './block.error-code';
import { UploadErrorCode } from './upload.error-code';
import { DownloadErrorCode } from './download.error-code';
import { LikeErrorCode } from './like.error-code';
import { OAuthErrorCode } from './oauth.error-code';

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
export const ErrorCode = {
  // Common
  ...CommonErrorCode,
  // Auth
  ...AuthErrorCode,
  // User
  ...UserErrorCode,
  // Album
  ...AlbumErrorCode,
  // Folder
  ...FolderErrorCode,
  // Photo
  ...PhotoErrorCode,
  // Chat
  ...ChatErrorCode,
  // Poll
  ...PollErrorCode,
  // Comment
  ...CommentErrorCode,
  // Mail
  ...MailErrorCode,
  // Reaction
  ...ReactionErrorCode,
  // Story
  ...StoryErrorCode,
  // StoryComment
  ...StoryCommentErrorCode,
  // Report
  ...ReportErrorCode,
  // Moderation
  ...ModerationErrorCode,
  // Block
  ...BlockErrorCode,
  // Upload
  ...UploadErrorCode,
  // Download
  ...DownloadErrorCode,
  // Like
  ...LikeErrorCode,
  // OAuth
  ...OAuthErrorCode,
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
export type ErrorCodeValue = `${ErrorCode}`;
