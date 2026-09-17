import type { AlbumBranding } from './album-branding.interface';
import type { AlbumPermissions } from './internal/album-permissions.interface';

export interface AlbumListItemResponse<TTimestamp = string>
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
  creatorId: string;
  created_at: TTimestamp;
  scannedAt: TTimestamp;
  coverPhoto: string | null;
  coverPhotoThumbnailUrl: string | null;
  /**
   * Total de membresías activas del álbum. Es una agregación del conjunto y
   * no se reduce por bloqueos entre identidades; las listas de nombres sí
   * aplican su filtro de visibilidad por separado.
   */
  participantCount: number;
  creatorName: string;
  /**
   * La marca del álbum: el logo de quien lo entrega y su nombre. `null` cuando
   * no hay marca, que es el caso de todo álbum de una cuenta sin plan.
   *
   * ── VIAJA EN LAS DOS LISTAS, Y ÉSA ES LA MITAD DEL PUNTO ────────────────
   * La misma tarjeta de álbum se dibuja en Home (donde entra el MIEMBRO) y en
   * Mi Estudio (donde entra quien administra). Si la marca viajara sólo en la
   * del organizador, el estudio se acreditaría ante sí mismo y no ante la
   * gente que vino a buscar sus fotos — o sea que la palanca de retención se
   * vería exactamente donde no sirve. Por eso el campo está en los DOS
   * contratos y con el mismo nombre.
   *
   * ── NO SE APAGA CUANDO EL PLAN VENCE ───────────────────────────────────
   * El derecho se mira al ESCRIBIRLA, nunca al leerla. Apagar la marca de un
   * álbum ya entregado sería degradar hacia atrás, que el modelo prohíbe con
   * todas las letras. Lo que se pierde al no tener plan es poder PONERLA.
   */
  branding: AlbumBranding | null;
}
