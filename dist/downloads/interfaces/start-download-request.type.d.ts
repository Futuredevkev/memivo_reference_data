import { DownloadContext } from '../../common';
export type StartDownloadRequest = {
    context: typeof DownloadContext.PROFESSIONAL_PHOTOS_SELECTION;
    albumId: string;
    photoIds: string[];
} | {
    context: typeof DownloadContext.CHAT_FILE;
    fileIds: string[];
};
