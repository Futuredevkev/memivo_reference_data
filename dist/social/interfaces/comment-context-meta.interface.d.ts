export interface CommentContextMeta {
    limit: number;
    hasOlder: boolean;
    olderCursor: string | null;
    /**
     * Indica que hay comentarios más nuevos fuera de la ventana. El consumidor
     * puede volver al listado vivo con un refetch; no existe paginación forward.
     */
    hasNewer: boolean;
}
