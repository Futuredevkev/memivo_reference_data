import type { AlbumBranding } from './album-branding.interface';

/**
 * El estado de la marca DESPUÉS de tocarla, sea al ponerla o al sacarla.
 *
 * Las dos operaciones contestan lo mismo —la marca que quedó— en vez de una
 * contestar el objeto y la otra nada: quien llama actualiza su copia con el
 * mismo campo en los dos casos, y `null` es el resultado legítimo de sacarla.
 * Con un `204` en el borrado, el cliente tendría que saber por qué camino
 * entró para saber qué escribir.
 */
export interface AlbumBrandingResponse {
  albumId: string;
  /** `null` cuando el álbum quedó sin marca. */
  branding: AlbumBranding | null;
}
