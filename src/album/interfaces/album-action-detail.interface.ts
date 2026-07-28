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
  /**
   * Cuántos invite-links quedaron revocados al rotar el acceso del álbum.
   *
   * El QR nuevo no se guarda acá a propósito: el registro de actividad lo lee
   * cualquier organizador, y un código de acceso vigente no es un dato de
   * auditoría — es una credencial.
   */
  revokedInvites?: number;
}
