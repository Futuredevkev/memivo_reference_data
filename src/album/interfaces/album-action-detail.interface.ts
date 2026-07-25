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
  /**
   * La historia moderada ya estaba archivada.
   *
   * Distingue dos actos que no son el mismo: retirar una historia viva de la
   * barra, y borrar un recuerdo del archivo del álbum.
   */
  archived?: boolean;
}
