import type { StickerReference } from '../../stickers';
import type { ReactionCounts, ReactionType } from '../../reactions';
import type { SocialAuthor } from './social-author.interface';

export interface CommentResponse<TTimestamp = string> {
  id: string;
  /**
   * `null` cuando lo que se mandó fue un sticker.
   *
   * Nullable en el tipo porque lo es en la columna, y la columna lo es porque
   * un comentario puede ser un sticker en vez de texto. El `CHECK` de la tabla
   * garantiza que exactamente uno de los dos esté presente, así que quien
   * dibuja no tiene que contemplar el caso «ninguno».
   */
  text: string | null;
  userId: string;
  guestPostId: string;
  user: SocialAuthor;
  created_at: TTimestamp;
  updated_at: TTimestamp;
  /**
   * El autor reescribió el texto después de publicarlo.
   *
   * Se puede editar un comentario desde el día uno, y hasta acá la conversación
   * quedaba cambiada SIN RASTRO: alguien lee, el autor reescribe, y nadie que
   * pasara después podía saber que el texto de arriba no es el que se respondió.
   * En una red social privada donde el comentario ES la conversación, eso es
   * reescribir la historia en silencio.
   *
   * **NO es derivable de `updated_at > created_at`.** Esa comparación es un
   * segundo camino: mueve el `updated_at` cualquier escritura de la fila —hoy el
   * contador de respuestas denormalizado, mañana lo que se agregue—, así que
   * marcaría como editado un comentario que nadie tocó. El hecho lo decide el
   * servidor en el mismo acto que escribe el texto, y viaja.
   *
   * **Sin ventana de gracia, por decisión del dueño.** Cualquier ventana es
   * exactamente el rato en el que se puede reescribir sin que nadie se entere,
   * que es lo que la marca existe para cerrar.
   *
   * Mismo nombre, tipo y default que `ChatMessageResponse.isEdited`: es el mismo
   * hecho sobre otra superficie, y ya tenía forma en el repo.
   */
  isEdited: boolean;
  responsesCount?: number;
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
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
