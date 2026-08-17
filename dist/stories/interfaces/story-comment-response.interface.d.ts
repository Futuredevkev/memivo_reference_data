import type { StoryCommentAuthor } from './story-comment-author.interface';
/** Story-comment payload shared by HTTP responses and socket events. */
export interface StoryCommentResponse<TTimestamp = string> {
    id: string;
    text: string;
    storyId: string;
    userId: string;
    user: StoryCommentAuthor;
    created_at: TTimestamp;
    updated_at: TTimestamp;
    /**
     * El autor reescribió el texto después de publicarlo. Ver el docblock de
     * `CommentResponse.isEdited`.
     *
     * Que la historia venza en 24 h NO lo exime, y la tentación de eximirlo es
     * justamente la ventana de gracia que el dueño descartó: un comentario de
     * historia se lee y se contesta dentro de esas 24 h, así que la ventana en la
     * que se puede reescribir sin que nadie se entere es EL flujo entero, no un
     * borde. La marca aparece siempre, en las tres superficies donde hay un texto
     * que otro ya leyó.
     */
    isEdited: boolean;
}
