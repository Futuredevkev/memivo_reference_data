import type { AlbumMemberRole } from '../../album';
import type { StickerReference } from '../../stickers';
import type { HighlightActor } from './internal/highlight-actor.interface';

/**
 * El comentario que gana un slot de destacados.
 *
 * ── POR QUÉ NO TIENE FECHA, Y POR QUÉ LA PERDIÓ ───────────────────────────
 * Llevaba un `created_at` que NINGUNA superficie dibujaba. Llegó cuando la
 * antigüedad se pintaba en casi todas las cards de la pantalla, y se quedó
 * cuando ese reloj se apagó en todas menos en la única que puede justificarlo
 * —el primer post del álbum, que gana por cronología y no por conteo—. Esa card
 * es un `HighlightPost`, no un comentario, así que acá la fecha no tenía
 * lector: el que la mira es el ÚNICO eje por el que se decide si un dato viaja.
 *
 * Y no era gratis. La consulta del slot es AGRUPADA, así que toda columna
 * seleccionada que no sea agregada tiene que estar además en el `GROUP BY` o
 * Postgres rechaza la sentencia entera: se pagaba una columna más en el
 * agrupamiento de la consulta más caliente de destacados para no dibujar nada.
 *
 * ── POR QUÉ SE FUE TAMBIÉN EL PARÁMETRO DE TIMESTAMP ──────────────────────
 * Era el único campo que lo usaba. Un parámetro genérico que ningún miembro
 * consume compila igual y es superficie muerta: el que lea `HighlightComment<X>`
 * después va a creer que `X` decide algo. Los slots que SÍ llevan fecha
 * —`HighlightPost`, `HighlightStory`— lo conservan, así que `AlbumHighlights`
 * sigue teniéndolo para ellos.
 */
export interface HighlightComment<TRole extends string = AlbumMemberRole> {
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
}
