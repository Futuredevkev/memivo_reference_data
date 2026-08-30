import type { AlbumMemberRole } from '../../album';
import type { StickerReference } from '../../stickers';
import type { HighlightActor } from './internal/highlight-actor.interface';

export interface HighlightComment<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  id: string;
  /**
   * `null` cuando el comentario destacado es un sticker.
   *
   * Nullable porque lo es la columna. Un sticker PUEDE ganar el slot —se
   * reacciona y se responde igual que a un texto— y esconderlo por eso sería
   * decidir un recorte de producto adentro de una query.
   */
  text: string | null;
  /**
   * El sticker del comentario destacado, `null` cuando lo que ganó fue texto.
   *
   * Viaja acá por lo mismo que en las otras cuatro superficies: exactamente uno
   * de los dos está presente —lo garantiza el `CHECK` de `comments`— y sin este
   * campo la tarjeta del destacado dibujaba unas comillas VACÍAS sobre el
   * comentario más reaccionado del álbum.
   */
  sticker: StickerReference | null;
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
