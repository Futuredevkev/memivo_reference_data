import { AlbumWriteSurface } from '../enums/album-write-surface.enum';

/**
 * Qué superficies corta el interruptor de publicación, y cuáles no.
 *
 * ── EL EJE ES PUBLICAR, NO CONVERSAR ──────────────────────────────────────
 * «No quiero que suban más fotos» y «no quiero que hablen» son dos decisiones
 * distintas. Metidas en el mismo interruptor, quien quiere una tiene que
 * aceptar la otra: cerrar el feed de un casamiento a las 4 AM dejaría además
 * sin comentar la foto que alguien subió a las 3. Silenciar la conversación es
 * otra palanca, con su propia pregunta, y no es la que se pidió.
 *
 * Por eso cortan **el post y la historia** —las dos son publicar una pieza
 * nueva en el álbum— y no cortan nada de lo que se cuelga de una pieza que ya
 * está: comentarios, respuestas, votos, likes, reacciones, etiquetas ni chat.
 *
 * ── POR QUÉ ES UN `Record` COMPLETO Y NO UNA LISTA DE LAS QUE CORTAN ──────
 * Porque una lista contesta sólo por lo que nombra. Con el `Record` exhaustivo,
 * la superficie que se agregue mañana no compila hasta que alguien escriba acá
 * si el interruptor la alcanza — y esa es la única forma de que la pregunta se
 * haga. Una lista de excepciones no tiene gate.
 *
 * ── ALCANCE: ESTO DICE QUÉ, NO DÓNDE ──────────────────────────────────────
 * Que cada superficie marcada acá pase de verdad por el validador es otra
 * afirmación, y la sostiene un gate del api que saca su corpus del árbol. Esta
 * tabla sola no lo prueba.
 */
export const ALBUM_POSTING_GATED_WRITE_SURFACES: Readonly<
  Record<AlbumWriteSurface, boolean>
> = {
  [AlbumWriteSurface.GUEST_POST]: true,
  [AlbumWriteSurface.STORY]: true,
  [AlbumWriteSurface.COMMENT]: false,
  [AlbumWriteSurface.RESPONSE]: false,
  [AlbumWriteSurface.STORY_COMMENT]: false,
  [AlbumWriteSurface.STORY_POLL_VOTE]: false,
  [AlbumWriteSurface.LIKE]: false,
  [AlbumWriteSurface.REACTION]: false,
  [AlbumWriteSurface.PHOTO_TAG]: false,
  [AlbumWriteSurface.CHAT_MESSAGE]: false,
};
