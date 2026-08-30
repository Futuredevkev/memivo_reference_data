import type { AlbumPermissions } from './internal/album-permissions.interface';

export interface AlbumAccessResponseAlbum<TTimestamp = string>
  extends AlbumPermissions {
  id: string;
  title: string;
  description: string | null;
  /**
   * @deprecated NADIE LO LEE, y se va en la próxima mayor.
   *
   * Medido sobre los tres consumidores del monorepo, no supuesto: `memivo_client`
   * no lo declara ni lo dibuja (sus 14 hits de `photoCount` son
   * `folder.photoCount` y el `detail.photoCount` del audit-log), `memivo_landing`
   * no lo nombra, y en `memivo_api` la única cadena que lo produce es
   * `album-entry` → `album-invite-redeem` → `buildAlbumResponse`.
   *
   * Lo que cuesta que siga siendo obligatorio (CACHE-073): cada entrada al álbum
   * paga un `COUNT(*)` sobre TODAS las fotos —sin filtro de tipo, así que ni
   * siquiera significa lo que su nombre sugiere— en el camino que el propio repo
   * identificó como susceptible de blast por un QR impreso. Es trabajo que sobra
   * para llenar un campo muerto.
   *
   * **Opcional primero y borrado después, a propósito**: mientras el campo fue
   * obligatorio, un cliente ya publicado que lo tipeara como requerido rompía al
   * parsear. Con `?` el productor puede dejar de mandarlo sin romper a nadie.
   */
  photoCount?: number;
  creatorId: string;
  creatorName: string;
  scannedAt: TTimestamp | null;
}
