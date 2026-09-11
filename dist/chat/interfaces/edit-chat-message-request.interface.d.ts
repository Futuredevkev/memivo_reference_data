import type { MentionAnnotation } from '../../mentions';
/**
 * La edición de un mensaje de texto. `mentions` reemplaza a las anteriores
 * junto con el contenido; ver `TextRequest` por qué ausente es vacío.
 */
export interface EditChatMessageRequest {
    content: string;
    mentions?: MentionAnnotation[];
}
