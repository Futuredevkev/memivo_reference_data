import { formatPersonDisplayName } from '../../common/helpers';
import { MENTION_TRIGGER } from '../constants';
import type { MentionAnnotation } from '../interfaces';

/**
 * LA INVARIANTE de una mención: el trozo del texto que la anotación señala dice
 * exactamente `@` + el nombre visible de la persona.
 *
 * ── POR QUÉ RECIBE LA PERSONA Y NO UN NOMBRE YA ARMADO ────────────────────
 * Porque el dueño único de la validez no puede recibir de afuera la mitad
 * peligrosa. Con un `displayName: string` de parámetro, cada llamador arma el
 * nombre con su propia derivación, y eran dos que no daban igual (ver
 * `formatPersonDisplayName`). Recibiendo `{ name, lastName }` la derivación
 * queda adentro y las dos puntas no pueden contestar distinto.
 *
 * ── LO QUE NO DECIDE ───────────────────────────────────────────────────────
 * Que la anotación esté bien FORMADA (enteros, dentro del texto, ordenadas, sin
 * solaparse, dentro del tope): eso es `findMentionAnnotationsDefect`, que no
 * necesita a la persona. Y tampoco decide si la persona puede leer el texto:
 * la audiencia es del servidor, que es el único que la conoce.
 */
export const mentionMatchesText = (
  text: string,
  annotation: Pick<MentionAnnotation, 'start' | 'length'>,
  person: { readonly name?: string | null; readonly lastName?: string | null },
): boolean =>
  text.slice(annotation.start, annotation.start + annotation.length) ===
  MENTION_TRIGGER + formatPersonDisplayName(person);
