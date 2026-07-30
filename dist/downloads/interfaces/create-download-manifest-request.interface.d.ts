import { DownloadContext } from '../../common';
import type { CreateDownloadManifestItemRequest } from './create-download-manifest-item-request.interface';
export interface CreateDownloadManifestRequest {
    context: DownloadContext;
    albumId?: string;
    items: CreateDownloadManifestItemRequest[];
}
