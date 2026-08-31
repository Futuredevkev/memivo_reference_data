import type { AlbumAccessPasswordChangeKind } from '../enums/album-access-password-change-kind.type';
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
 * Son SIETE los campos sin lector: `folderIds`, `folderNames`, `oldRole`,
 * `newRole`, `oldName`, `newName` y `revokedInvites`.
 *
 * CINCO están declarados en `INTENTIONAL_WITHOUT_READER` del auditor con este
 * motivo. Los otros dos —`folderIds` y `newName`— NO están, y es deliberado: su
 * nombre colisiona con otros tipos del cliente, así que el matcher permisivo del
 * auditor los da por vivos y nunca los reporta; una excusa para ellos sería
 * configuración muerta que caduca en cada corrida. Su motivo es éste, y este
 * docblock es el único lugar donde se lee — está dicho también en
 * `scripts/audit-response-fields.js`, arriba del mapa.
 *
 * La UI arma su oración con `photoCount`, `folderCount`, `archived`,
 * `changedFields` e `isVisible`; el resto existe para la pregunta forense, que
 * se contesta contra la base.
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
    /**
     * Hasta cuándo quedó vigente el `qrCode` después de extenderlo.
     *
     * A diferencia de su hermano de arriba, esto SÍ se guarda: una fecha no es una
     * credencial. Y es el único dato que hace útil el registro de una extensión —
     * sin él la entrada diría «alguien extendió» sin decir hasta cuándo, que es
     * exactamente la pregunta que se le va a hacer al log el día que haya que
     * explicar por qué un link seguía abierto.
     */
    qrCodeExpiresAt?: string;
    /**
     * El estado NUEVO de la protección; la contraseña en sí no se registra nunca.
     *
     * Se conserva porque los registros anteriores a [AlbumAccessPasswordChangeKind]
     * sólo tienen esto: borrarlo dejaría al lector sin nada que decir sobre ellos.
     * Para las entradas nuevas, lo que manda es `accessPasswordKind`.
     */
    hasAccessPassword?: boolean;
    /**
     * QUÉ LE PASÓ a la contraseña de acceso: se activó, se cambió, o se quitó.
     *
     * EL DEFECTO QUE CIERRA: con sólo el booleano de arriba no se puede
     * distinguir «la activó» de «la cambió» —vale `true` en los dos casos— y el
     * registro afirmaba lo primero en los dos. Es el servidor el único que puede
     * contestarlo, porque es el único que ve el estado anterior dentro del lock.
     */
    accessPasswordKind?: AlbumAccessPasswordChangeKind;
    /**
     * Por qué Memivo apagó —o volvió a prender— el álbum.
     *
     * ── POR QUÉ SE GUARDA ─────────────────────────────────────────────────
     * Porque una sanción sin motivo registrado no es evidencia de nada. El
     * registro del álbum es append-only y sobrevive a todo lo que se pueda
     * borrar adentro del álbum, así que es el único lugar donde la pregunta
     * «¿por qué se apagó esto?» tiene respuesta después.
     *
     * ── ⚠️ ES TEXTO VISIBLE, NO UNA NOTA INTERNA ──────────────────────────
     * El registro de actividad lo lee cualquier organizador del álbum, así que
     * esto se escribe PARA ÉL: es la explicación que va a leer quien pida la
     * revisión que el corpus legal promete. Las notas internas de un moderador
     * —las que no se le muestran a nadie— viven en el expediente, que es otra
     * tabla y tiene otra audiencia.
     *
     * Es la misma distinción que ya gobierna a `revokedInvites`, que guarda el
     * NÚMERO y nunca el código: lo que entra acá es lo que se puede leer en voz
     * alta.
     */
    moderationReason?: string;
}
