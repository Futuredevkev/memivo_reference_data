import { DownloadManifestItemStatus } from '../enums';

export type MarkDownloadItemCompleteStatus =
  | DownloadManifestItemStatus.COMPLETED
  | DownloadManifestItemStatus.FAILED;
