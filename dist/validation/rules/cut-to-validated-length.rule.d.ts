/**
 * Corta un texto al largo que el servidor acepta, contando como él cuenta y sin
 * partir un carácter por la mitad.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El cortador vivía en el cliente y cortaba por unidades UTF-16, apoyado en un
 * docblock que afirmaba que del otro lado se cuenta igual. No se cuenta igual
 * (ver [validatedTextLength]): con emoji el campo frenaba en la MITAD del tope y
 * el contador se pintaba de rojo con «280/280» cuando el servidor habría
 * aceptado 280 emojis de verdad.
 *
 * Vive acá y no en el cliente porque el corte y el rechazo tienen que usar el
 * MISMO número: son las dos puntas del mismo tope.
 *
 * ── POR QUÉ NO ES UN `slice` ──────────────────────────────────────────────
 * Porque un emoji ocupa dos unidades y cortar en seco deja media pareja suelta:
 * un carácter que no existe, que se dibuja como un rombo con signo de pregunta y
 * que viaja así al servidor. El nativo de iOS ya hacía esta cuenta adentro de su
 * `maxLength` (`rangeOfComposedCharacterSequenceAtIndex`); al sacarle el tope al
 * nativo para poder ENTERARSE del corte, esa defensa se vino con él.
 *
 * ── LO QUE NO HACE, DICHO ─────────────────────────────────────────────────
 * No respeta secuencias de varios puntos de código —una familia unida por ZWJ,
 * una bandera, un emoji con tono de piel— y no puede: el servidor tampoco las
 * respeta, así que cortar por grafemas dejaría al campo frenando antes de lo que
 * el servidor acepta, que es un tope distinto del declarado. Lo que se defiende
 * es el caso que produce un carácter INVÁLIDO, no el que produce uno feo. Lo
 * único que cambió respecto de la versión anterior es CUÁNTO entra, no dónde se
 * puede cortar.
 */
export declare const cutToValidatedLength: (text: string, max: number) => string;
