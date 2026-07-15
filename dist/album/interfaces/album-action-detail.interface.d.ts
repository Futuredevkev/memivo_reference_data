export interface AlbumActionDetail {
    photoCount?: number;
    folderCount?: number;
    folderIds?: string[];
    folderNames?: string[];
    oldRole?: string;
    newRole?: string;
    changedFields?: string[];
    isVisible?: boolean;
    oldName?: string;
    newName?: string;
}
