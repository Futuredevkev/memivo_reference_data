import type { NotificationMetadataByType } from './notification-metadata-by-type.type';
export type NotificationMetadata = NotificationMetadataByType[keyof NotificationMetadataByType];
