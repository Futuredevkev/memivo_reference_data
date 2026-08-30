import type { StickerReference } from '../../stickers';
import type { StoryCommentAuthor } from './story-comment-author.interface';

/** Story-comment payload shared by HTTP responses and socket events. */
export interface StoryCommentResponse<TTimestamp = string> {
  id: string;
  /**
   * `null` cuando lo que se mandó fue un sticker.
   *
   * Nullable en el tipo porque lo es en la columna, y la columna lo es porque
   * un comentario de historia puede ser un sticker en vez de texto. El `CHECK` de la tabla
   * garantiza que exactamente uno de los dos esté presente, así que quien
   * dibuja no tiene que contemplar el caso «ninguno».
   */
  text: string | null;
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
  /**
   * El sticker, `null` cuando lo que se mandó fue texto.
   *
   * Viene resuelto —con sus URLs ya derivadas por el servidor— para que la
   * superficie que lo dibuja no tenga que pedir nada más. Es un `leftJoin` 1:1
   * en la misma consulta que trae los comentarios: no multiplica filas y no agrega un
   * round-trip, que es lo que separa esto de un N+1.
   */
  sticker: StickerReference | null;
}
