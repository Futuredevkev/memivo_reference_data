import { DownloadManifestStatus } from '../enums';
import type { DownloadManifestItemPayload } from './download-manifest-item-payload.interface';
export interface DownloadManifestResponse {
    manifestId: string;
    status: DownloadManifestStatus;
    expiresAt: string;
    items: DownloadManifestItemPayload[];
}
