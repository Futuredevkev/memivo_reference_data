import { DownloadContext } from '../../common';
export interface CreateDownloadJobPayload {
    context: DownloadContext;
    folderId?: string;
    folderIds?: string[];
}
