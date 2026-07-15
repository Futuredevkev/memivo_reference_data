import { DownloadManifestItemStatus } from '../enums';

export const MARK_DOWNLOAD_ITEM_COMPLETE_ALLOWED_STATUSES = [
  DownloadManifestItemStatus.COMPLETED,
  DownloadManifestItemStatus.FAILED,
] as const;
