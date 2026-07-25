import type { MediaComposition } from '../../media';
import type { StoryState } from '../enums';
import type { StoryAuthor } from './story-author.interface';
import type { StoryFileInfo } from './story-file-info.interface';
import type { StoryTagInfo } from './story-tag-info.interface';

/** Story payload emitted by HTTP endpoints and album sockets. */
export interface StoryResponse<TTimestamp = string> {
  id: string;
  albumId: string;
  author: StoryAuthor;
  file: StoryFileInfo;
  caption?: string;
  composition?: MediaComposition | null;
  expiresAt: TTimestamp;
  created_at: TTimestamp;
  tags: StoryTagInfo[];
  viewedByMe: boolean;
  viewCount: number;
  /**
   * Derivado de `expiresAt` en el servidor. Requerido: el cliente decide con él
   * qué puede hacerse sobre la historia, y derivarlo del reloj local abriría una
   * segunda definición de "archivada".
   */
  state: StoryState;
  /** Encuesta asociada, si la hay. `null`/ausente = la historia no tiene. */
  pollId?: string | null;
}
