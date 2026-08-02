/**
 * Payload por acción del audit-log del álbum.
 *
 * ⚠️ ESTE TIPO NO ES SÓLO CABLE: gobierna también la columna jsonb
 * `album_action_logs.detail`. Por eso la regla del bloque 41 —«campo sin lector
 * en el cliente, se borra»— NO se le aplica igual: borrar un campo de acá borra
 * EVIDENCIA, no bytes. El log es append-only y sobrevive al borrado del objeto,
 * así que `folderNames` es el único registro de QUÉ carpetas se borraron y
 * `oldName` el único del nombre anterior de una que se renombró; el nombre
 * actual ya no existe en ningún lado.
 *
 * Los siete campos sin lector están declarados en
 * `INTENTIONAL_WITHOUT_READER` del auditor con este motivo. La UI arma su
 * oración con `photoCount`, `folderCount`, `archived`, `changedFields` e
 * `isVisible`; el resto existe para la pregunta forense, que se contesta
 * contra la base.
 */
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
  /** New protection state; the password itself is deliberately never logged. */
  hasAccessPassword?: boolean;
}
