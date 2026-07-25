import type { StoryNotificationMetadata } from './story-notification-metadata.interface';
/**
 * Metadata de `STORY_COMMENT`.
 *
 * Existe separada de `StoryNotificationMetadata` (que comparte con
 * `TAGGED_IN_STORY`) porque necesita `commentId`: con el Baúl la historia ya no
 * desaparece, así que borrar un comentario dejaba de limpiar su notificación
 * como efecto colateral de la expiración. Sin este id no hay forma de saber qué
 * notificación retirar.
 */
export interface StoryCommentNotificationMetadata extends StoryNotificationMetadata {
    commentId: string;
}
