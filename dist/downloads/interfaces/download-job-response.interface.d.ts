import { DownloadJobStatus } from '../enums';
import type { DownloadManifestResponse } from './download-manifest-response.interface';
export interface DownloadJobResponse {
    jobId: string;
    status: DownloadJobStatus;
    expiresAt: string;
    totalCount: number;
    totalManifests: number;
    manifests: DownloadManifestResponse[];
}
