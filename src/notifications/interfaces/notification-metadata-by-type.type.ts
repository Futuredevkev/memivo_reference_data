import { NotificationType } from '../enums';
import type { AlbumModerationAlertMetadata } from './internal/album-moderation-alert-metadata.interface';
import type { AlbumNotificationMetadata } from './album-notification-metadata.interface';
import type { ChatGroupNotificationMetadata } from './chat-group-notification-metadata.interface';
import type { ChatMessageNotificationMetadata } from './chat-message-notification-metadata.interface';
import type { ChatReactionNotificationMetadata } from './chat-reaction-notification-metadata.interface';
import type { CommentNotificationMetadata } from './comment-notification-metadata.interface';
import type { ContentRemovalMetadata } from './internal/content-removal-metadata.interface';
import type { CountedAlbumMetadata } from './counted-album-metadata.interface';
import type { DownloadReadyMetadata } from './download-ready-metadata.interface';
import type { PhotoNotificationMetadata } from './photo-notification-metadata.interface';
import type { PhotoUploadNotificationMetadata } from './photo-upload-notification-metadata.interface';
import type { PhotosBatchUploadMetadata } from './photos-batch-upload-metadata.interface';
import type { PollNotificationMetadata } from './poll-notification-metadata.interface';
import type { ReactionOnPhotoMetadata } from './reaction-on-photo-metadata.interface';
import type { StoryCommentNotificationMetadata } from './story-comment-notification-metadata.interface';
import type { StoryNotificationMetadata } from './story-notification-metadata.interface';
import type { StoryUploadNotificationMetadata } from './story-upload-notification-metadata.interface';

export type NotificationMetadataByType = {
  [NotificationType.ALBUM_DELETED]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_HIDDEN]: AlbumNotificationMetadata;
  [NotificationType.MEMBER_KICKED]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_ORGANIZER_PROMOTED]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_ORGANIZER_REMOVED]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_OWNERSHIP_TRANSFERRED]: AlbumNotificationMetadata;
  [NotificationType.GUEST_POST_UPLOAD_FAILED]: AlbumNotificationMetadata;
  [NotificationType.PROFESSIONAL_PHOTOS_UPLOAD_FAILED]: AlbumNotificationMetadata;
  [NotificationType.STORY_UPLOAD_FAILED]: AlbumNotificationMetadata;
  [NotificationType.HIGHLIGHTS_REMINDER]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_QR_CODE_EXPIRING]: AlbumNotificationMetadata;
  [NotificationType.ALBUM_MODERATION_ALERT]: AlbumModerationAlertMetadata;
  [NotificationType.CONTENT_REMOVED_BY_ORGANIZER]: ContentRemovalMetadata;
  [NotificationType.CONTENT_REMOVED_BY_MEMIVO]: ContentRemovalMetadata;
  [NotificationType.PROFESSIONAL_PHOTOS_UPLOADED]: CountedAlbumMetadata;
  [NotificationType.MEMIVO_MOMENTS]: CountedAlbumMetadata;
  [NotificationType.LIKE_PHOTO]: PhotoNotificationMetadata;
  [NotificationType.TAGGED_IN_PHOTO]: PhotoNotificationMetadata;
  [NotificationType.COMMENT_PHOTO]: CommentNotificationMetadata;
  [NotificationType.REPLY_COMMENT]: CommentNotificationMetadata;
  [NotificationType.REACTION_COMMENT]: ReactionOnPhotoMetadata;
  [NotificationType.REACTION_RESPONSE]: ReactionOnPhotoMetadata;
  [NotificationType.CHAT_INVITATION]: ChatGroupNotificationMetadata;
  [NotificationType.CHAT_MEMBER_KICKED]: ChatGroupNotificationMetadata;
  [NotificationType.CHAT_GROUP_DELETED]: ChatGroupNotificationMetadata;
  [NotificationType.MEMBER_PROMOTED_ADMIN]: ChatGroupNotificationMetadata;
  [NotificationType.MEMBER_DEMOTED_ADMIN]: ChatGroupNotificationMetadata;
  [NotificationType.CHAT_GROUP_OWNERSHIP_TRANSFERRED]: ChatGroupNotificationMetadata;
  [NotificationType.CHAT_MEDIA_UPLOAD_FAILED]: ChatGroupNotificationMetadata;
  [NotificationType.NEW_CHAT_MESSAGE]: ChatMessageNotificationMetadata;
  [NotificationType.CHAT_MESSAGE_REPLY]: ChatMessageNotificationMetadata;
  [NotificationType.CHAT_MESSAGE_REACTION]: ChatReactionNotificationMetadata;
  [NotificationType.POLL_CREATED]: PollNotificationMetadata;
  [NotificationType.TAGGED_IN_STORY]: StoryNotificationMetadata;
  [NotificationType.STORY_COMMENT]: StoryCommentNotificationMetadata;
  [NotificationType.GUEST_POST_UPLOAD_READY]: PhotoUploadNotificationMetadata;
  [NotificationType.STORY_UPLOAD_READY]: StoryUploadNotificationMetadata;
  [NotificationType.PROFESSIONAL_PHOTOS_UPLOAD_READY]: PhotosBatchUploadMetadata;
  [NotificationType.DOWNLOAD_READY]: DownloadReadyMetadata;
  /**
   * No hay metadata de transporte para esta push-only. El índice con el que el
   * servidor elige el copy es un input privado del renderer y se descarta antes
   * de serializar; modelarlo acá lo filtraba a `NotificationResponse` y a
   * `NotificationMetadataView` como si viajara al cliente.
   */
  [NotificationType.DAILY_MOTIVATIONAL]: never;
};
