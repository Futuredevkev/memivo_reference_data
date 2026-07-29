import type { AlbumPermissions } from './internal/album-permissions.interface';

export interface OrganizerAlbumListItemResponse<TTimestamp = string>
  extends AlbumPermissions {
  id: string;
  title: string;
  /**
   * Nullable, y ésta es la corrección: la columna es `text NULL`, la entidad y
   * el modelo del cliente ya lo decían, y el mismo dato viaja tipado
   * `string | null` en `AlbumAccessResponseAlbum`. Sólo estos contratos
   * prometían lo que el cable no garantiza — y el tipo AUTORIZA
   * `description.trim()`, que compila, pasa lint, pasa los dos auditores
   * (miden identidad de símbolos, no nullability) y revienta en runtime la
   * primera vez que alguien abre un álbum sin descripción.
   */
  description: string | null;
  qrCode: string;
  isVisible: boolean;
  viewCount: number;
  coverPhoto: string | null;
  coverPhotoThumbnailUrl: string | null;
  creatorId: string;
  created_at: TTimestamp;
  updated_at: TTimestamp;
}
