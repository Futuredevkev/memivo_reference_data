/**
 * Las cifras que pinta el modal de estadísticas del álbum.
 *
 * `albumId`, `title` y `created_at` estaban acá y no los leía nadie (H-071): el
 * modal ya recibe el título por props y se abre desde el álbum, así que
 * repetir su identidad en el cuerpo era describir dos veces lo mismo.
 */
export interface AlbumStats {
  totalParticipants: number;
  postCount: number;
  professionalPhotoCount: number;
  chatGroupCount: number;
  professionalPhotosDownloaded: number;
  foldersDownloaded: number;
  isActive: boolean;
}
