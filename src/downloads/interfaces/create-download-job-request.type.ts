import { DownloadContext } from '../../common';

export type CreateDownloadJobRequest =
  | {
      context: typeof DownloadContext.PROFESSIONAL_PHOTOS_FOLDER_ALL;
      folderId: string;
    }
  | {
      context: typeof DownloadContext.PROFESSIONAL_PHOTOS_FOLDERS_SELECTION;
      folderIds: string[];
    };
