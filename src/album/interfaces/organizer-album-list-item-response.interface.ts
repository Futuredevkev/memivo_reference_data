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
  /**
   * Cuándo deja de resolver el `qrCode`. **Nunca es nulo, y por decisión.**
   *
   * Viaja al dueño porque es información SUYA sobre su propio código: sin esto
   * el vencimiento existe en el servidor y la única persona a la que protege no
   * se entera —el código del evento muere y nadie lo vio venir—.
   *
   * **NO existe «sin vencimiento»** (decisión del dueño, 13 ago, por seguridad):
   * un código sólo se puede EXTENDER +30 días, cuantas veces haga falta, y no
   * hay forma de quitarle el plazo ni desde el API ni desde el cliente. La
   * columna es `NOT NULL` en la base, así que esto no es una convención que se
   * pueda romper por descuido.
   *
   * NO va en el preview público de `/join/:qrCode`: ahí no hay dueño a quien
   * informarle, y el que escanea sólo necesita saber si el código sirve —eso ya
   * se lo dice el error, no una fecha.
   */
  qrCodeExpiresAt: TTimestamp;
  isVisible: boolean;
  viewCount: number;
  coverPhoto: string | null;
  coverPhotoThumbnailUrl: string | null;
  creatorId: string;
  /** Whether new joins are protected. The hash is never part of the wire contract. */
  hasAccessPassword: boolean;
  created_at: TTimestamp;
}
