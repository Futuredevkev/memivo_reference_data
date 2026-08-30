import type { ResourceType } from '../../../media';
export interface ChatMessageFileResponse {
    id: string;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    resourceType: ResourceType;
    filterId?: string | null;
    /**
     * El nombre que el archivo tenía en el teléfono de quien lo mandó.
     *
     * Sólo lo traen los documentos, y por eso es opcional: un `publicId` es un
     * UUID, así que sin este campo la burbuja de un `.pdf` no tendría cómo
     * decir de qué archivo se trata. Para imagen, video y audio el nombre no lo
     * mira nadie —la miniatura ya dice qué es— y no se persiste.
     */
    originalFilename?: string | null;
    /**
     * El peso del asset, para que la burbuja de un documento pueda decirlo antes
     * de que alguien lo baje.
     *
     * Llega como string porque en Postgres es `bigint` y el driver lo devuelve
     * así; convertirlo a `number` acá escondería el motivo y perdería precisión
     * en el borde. Nulo en los assets anteriores al tracking de tamaño.
     */
    sizeBytes?: string | null;
}
