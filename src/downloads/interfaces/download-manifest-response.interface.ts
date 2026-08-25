import type { DownloadManifestItemPayload } from './download-manifest-item-payload.interface';

export interface DownloadManifestResponse {
  manifestId: string;
  expiresAt: string;
  items: DownloadManifestItemPayload[];
}
