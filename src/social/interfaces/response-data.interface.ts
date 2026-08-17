import type { ReactionCounts, ReactionType } from '../../reactions';
import type { SocialAuthor } from './social-author.interface';

export interface ResponseData<TTimestamp = string> {
  id: string;
  text: string;
  commentId: string;
  userId: string;
  user: SocialAuthor;
  created_at: TTimestamp;
  updated_at: TTimestamp;
  /**
   * El autor reescribió el texto después de publicarlo. Ver el docblock de
   * `CommentResponse.isEdited`, que explica por qué el hecho lo decide el
   * servidor y por qué no se deriva de las marcas de tiempo.
   *
   * Va acá y no sólo en el comentario porque **es el mismo defecto**, y el
   * backend lo dice con todas las letras: el propio `ResponseService.update`
   * lleva escrito «Mismo defecto que `CommentService.updateComment`» dos veces.
   * Una respuesta es parte de la misma conversación que el comentario del que
   * cuelga; marcar uno y el otro no habría dejado la mitad del hilo sin rastro.
   */
  isEdited: boolean;
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
}
