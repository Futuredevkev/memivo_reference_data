import type { AlbumMemberRole } from '../../album';
import type { HighlightActor } from './internal/highlight-actor.interface';
/**
 * Historia destacada de un álbum. `id` es el **storyId** y es el único target de
 * navegación (el cliente lo pasa a `navigateToStory`).
 *
 * NO lleva `state` ni `expiresAt` a propósito: el payload vive hasta 60 s en
 * cache, así que un estado embebido podría estar vencido al momento del tap. El
 * destino se resuelve ahí, contra el servidor.
 *
 * `count` es SIEMPRE un número agregado: ninguna identidad de comentarista,
 * espectador o votante viaja en este tipo.
 */
export interface HighlightStory<TTimestamp = string, TRole extends string = AlbumMemberRole> {
    id: string;
    caption: string | null;
    user: HighlightActor<TRole>;
    count: number;
    thumbnailUrl: string | null;
    created_at: TTimestamp;
}
