"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumPostingMode = void 0;
/**
 * Quién puede publicar en el álbum, AHORA.
 *
 * ── POR QUÉ UN SOLO EJE Y NO «UN INTERRUPTOR» MÁS «UN HORARIO» ────────────
 * El pedido llegó como dos cosas —«que sólo publiquen los organizadores» y
 * «que se pueda programar una hora»— y modelarlas como dos columnas parecía lo
 * natural. No lo es: apenas conviven una columna de modo y una ventana,
 * aparece la pregunta «¿qué pasa si el modo dice sólo-organizadores y la
 * ventana está abierta?», y ésa es la firma exacta de DOS FUENTES para la
 * misma decisión. No hay respuesta correcta a esa pregunta porque la pregunta
 * no debería existir.
 *
 * Los cuatro miembros son cuatro FORMAS de contestar lo mismo, así que son un
 * tipo discriminado con un solo resolvedor —[resolveAlbumPosting]— y nadie
 * más decide.
 *
 * ── LO QUE SE COMPRA CON EL DISCRIMINADOR ─────────────────────────────────
 * Un miembro nuevo (`WEEKLY`, por ejemplo) rompe `tsc` en cada lugar que hoy
 * decide, en vez de entrar en silencio al comportamiento viejo. Esa es la
 * diferencia entre un tipo exhaustivo y una lista de excepciones: la lista no
 * tiene gate.
 */
var AlbumPostingMode;
(function (AlbumPostingMode) {
    /** Publica cualquier miembro. Es el valor por omisión y el de siempre. */
    AlbumPostingMode["EVERYONE"] = "EVERYONE";
    /** Publican sólo quienes organizan. El interruptor manual. */
    AlbumPostingMode["ORGANIZERS_ONLY"] = "ORGANIZERS_ONLY";
    /** Una ventana única entre dos instantes absolutos. Al vencer, no reabre. */
    AlbumPostingMode["ONE_SHOT"] = "ONE_SHOT";
    /** Una ventana que se repite cada día en la zona horaria del ÁLBUM. */
    AlbumPostingMode["DAILY"] = "DAILY";
})(AlbumPostingMode || (exports.AlbumPostingMode = AlbumPostingMode = {}));
