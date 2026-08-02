export interface CreateAlbumRequest {
    title: string;
    description?: string;
    /** Optional access secret. Omitted means that the album has no password. */
    password?: string;
}
