"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORY_EXPIRY_MINUTES = void 0;
/**
 * CUÁNTOS MINUTOS vive una historia.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El número vivía sólo en el api y CUATRO docblocks de tres repos afirmaban que
 * eran 24 horas: dos en el cliente —uno adentro del `because` con el que la
 * tabla de ausencias clasifica a `STORY_EXPIRED`, o sea dato y no comentario—,
 * uno adentro del `.d.ts` que este paquete publica, y su espejo palabra por
 * palabra en la entidad del api. La app destruye historias a los 60 minutos
 * desde el commit `6e484a46`; el párrafo falso sobrevivió a todos los barridos
 * porque el número del código estaba bien y lo que mentía era la prosa, y
 * ningún gate mide si un docblock dice algo.
 *
 * O sea: no es «el cliente podría desincronizarse». Ya estaba desincronizado,
 * por un factor de 24.
 *
 * ── POR QUÉ EN MINUTOS Y NO EN MILISEGUNDOS ───────────────────────────────
 * Porque el MINUTO es la unidad en la que este plazo se decide y se dice: la
 * frase de `errors.STORY_EXPIRED` lo cuenta en minutos. Los milisegundos son
 * cómo el servidor lo aplica, y eso lo deriva él a partir de acá — al revés,
 * cada lector tendría que dividir, y una división a mano en varios lugares es
 * exactamente de dónde salen los números que no coinciden.
 *
 * ── POR QUÉ 60 Y NO 24 HORAS ──────────────────────────────────────────────
 * Es la decisión del dueño, tomada después de probar 30 y de considerar 24 h: la
 * historia de Memivo no compite con la de las redes abiertas, es el pulso de un
 * evento que está pasando. Una ventana de un día convierte «esto está pasando
 * ahora» en un álbum paralelo, que es lo que el Baúl ya resuelve mejor.
 *
 * Y el número tiene DOS consumidores derivados que hay que recalibrar si alguna
 * vez se mueve, porque ninguno se entera solo: el cap de historias activas por
 * álbum —200, dimensionado sobre esta ventana— y el enunciado del score de
 * Memivo, cuyo decaimiento se come ~9,5 % en estos 60 minutos y se comería el
 * 91 % en 1440.
 */
exports.STORY_EXPIRY_MINUTES = 60;
