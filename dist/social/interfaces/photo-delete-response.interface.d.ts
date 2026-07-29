export interface PhotoDeleteResponse {
    message: string;
    deletedCount: number;
    /**
     * Posts media-only eliminados como consecuencia de quitar su última foto.
     * Permite al cliente cerrar el composer y retirar la publicación usando el
     * resultado autoritativo, sin inferir el estado concurrente del servidor.
     */
    deletedPostIds: string[];
}
