import type { StickerReference } from '../../stickers';
import type { ReactionCounts, ReactionType } from '../../reactions';
import type { SocialAuthor } from './social-author.interface';

export interface ResponseData<TTimestamp = string> {
  id: string;
  /**
   * `null` cuando lo que se mandó fue un sticker.
   *
   * Nullable en el tipo porque lo es en la columna, y la columna lo es porque
   * un respuesta puede ser un sticker en vez de texto. El `CHECK` de la tabla
   * garantiza que exactamente uno de los dos esté presente, así que quien
   * dibuja no tiene que contemplar el caso «ninguno».
   */
  text: string | null;
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
  /**
   * El sticker, `null` cuando lo que se mandó fue texto.
   *
   * Viene resuelto —con sus URLs ya derivadas por el servidor— para que la
   * superficie que lo dibuja no tenga que pedir nada más. Es un `leftJoin` 1:1
   * en la misma consulta que trae las respuestas: no multiplica filas y no agrega un
   * round-trip, que es lo que separa esto de un N+1.
   */
  sticker: StickerReference | null;
}
