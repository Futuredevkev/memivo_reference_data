import type { AlbumMemberRole } from '../../album';
import type { HighlightActor } from './internal/highlight-actor.interface';

export interface HighlightComment<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  id: string;
  text: string;
  guestPostId: string;
  user: HighlightActor<TRole>;
  /**
   * Métrica del slot. Se llama `count` y no `reactionCount` porque no siempre
   * son reacciones: en "el comentario con más respuestas" es un conteo de
   * respuestas, y el nombre viejo afirmaba lo contrario.
   */
  count: number;
  created_at: TTimestamp;
}
