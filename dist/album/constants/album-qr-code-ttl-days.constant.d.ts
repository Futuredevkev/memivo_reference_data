/**
 * CUÁNTOS DÍAS vive un código QR de álbum, y cuántos suma cada extensión.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Este número estaba escrito en TRES lugares que no se conocen entre sí: el
 * servidor lo tenía como `ALBUM_QR_CODE_TTL_MS`, el cliente lo espejaba en su
 * propia constante —cuyo docblock declaraba la deuda con todas las letras: «es
 * un espejo, y no hay gate que lo sostenga»— y el registro de actividad lo
 * llevaba TIPEADO A MANO dentro de la frase, en los tres idiomas.
 *
 * El del registro era el peor: el botón interpolaba la constante y la frase no,
 * así que el día que el plazo cambiara, el botón diría lo nuevo y el registro
 * seguiría afirmando «extendió 30 días» sobre algo que no pasó. Un registro de
 * auditoría que puede decir algo falso es peor que uno que no dice nada.
 *
 * ── POR QUÉ EN DÍAS Y NO EN MILISEGUNDOS ──────────────────────────────────
 * Porque el DÍA es la unidad en la que este plazo se decide y se dice: el botón
 * ofrece «Extender 30 días» y el registro lo cuenta igual. Los milisegundos son
 * cómo el servidor lo aplica, y eso lo deriva él a partir de acá — al revés,
 * cada lector tendría que dividir, y una división a mano en tres lugares es
 * exactamente de dónde salen los números que no coinciden.
 *
 * ── POR QUÉ 30 DÍAS ───────────────────────────────────────────────────────
 * Es el techo de lo que dura el evento típico más su cola de subidas: la gente
 * sube las fotos del casamiento durante las semanas siguientes, y un código que
 * muere el lunes deja afuera justo a los que tardaron. Errarle por abajo es el
 * error caro; el de arriba lo corrige el organizador rotando el código, que es
 * una acción que ya existe.
 */
export declare const ALBUM_QR_CODE_TTL_DAYS = 30;
