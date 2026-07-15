export interface DownloadManifestItemPayload {
    id: string;
    clientDownloadId: string;
    downloadUrl: string;
    suggestedFilename: string;
    mimeType: string;
    sizeBytes: number | null;
}
