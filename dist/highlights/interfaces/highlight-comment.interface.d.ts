import type { AlbumMemberRole } from '../../album';
import type { StickerReference } from '../../stickers';
import type { HighlightActor } from './internal/highlight-actor.interface';
/**
 * El comentario que gana uno de los slots de destacados.
 *
 * ── POR QUÉ NO LLEVA FECHA, Y NO ES UN OLVIDO ────────────────────────────────
 * Los tres slots de comentario —el más gracioso, el menos gracioso y el más
 * respondido— ganan por CONTEO. Para ellos el cuándo no contesta ninguna
 * pregunta: la tarjeta está ahí por el número, y la fecha se leía suelta debajo
 * del texto sin anclarse a nada. El campo había llegado por un slot distinto
 * —el primer post del álbum, que es el único que gana por cronología— y se
 * dibujó en las once cards porque estaba en el payload, no porque alguien lo
 * decidiera once veces.
 *
 * Al sacar el reloj de las cards de comentario el campo se quedó sin un solo
 * lector, y un campo que viaja sin lector es exactamente lo que la casa
 * persigue: cuesta una columna en el `GROUP BY` y un alias en la query, en la
 * consulta que arma los once slots de una pantalla.
 *
 * **Lo que NO hay que hacer**: devolverlo «por si alguna vista lo necesita». Si
 * un slot de comentario alguna vez rankea por fecha, lo que cambia primero es
 * `HIGHLIGHT_SLOT_RANKING` en el api —que es el dueño único de ese eje— y el
 * campo vuelve con ese slot, no antes.
 *
 * Por eso este tipo no es genérico sobre el timestamp: no le queda ninguno.
 * `HighlightUser` ya venía siendo así por el mismo motivo.
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
