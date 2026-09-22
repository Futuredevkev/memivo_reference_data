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
    /**
     * Las historias del álbum que YA VENCIERON, o sea las que el Baúl conserva.
     *
     * Es el conteo del archivo, no de las historias vivas: una historia activa
     * todavía se ve en el feed y va a entrar acá sola cuando expire, así que
     * sumarla haría que el número bajara con el tiempo sin que nadie borre nada.
     */
    archivedStoryCount: number;
    /**
     * Todo lo que la gente DEJÓ sobre el contenido del álbum: me gusta,
     * comentarios, respuestas, reacciones y comentarios de historia.
     *
     * No incluye la autoría —publicar un post o una historia—, que ya tiene sus
     * propios renglones arriba; contarla acá sería el mismo hecho dos veces en la
     * misma pantalla. Qué actos entran lo decide UNA sola tabla del api, la misma
     * que alimenta el highlight de la persona más interactiva, para que las dos
     * cifras no puedan contar universos distintos.
     */
    interactionCount: number;
    isActive: boolean;
}
