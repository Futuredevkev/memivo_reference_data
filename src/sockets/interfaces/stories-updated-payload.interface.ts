import type { StoryBroadcastEntry } from './story-broadcast-entry.type';

/**
 * El frame de `stories.updated`: la lista completa de historias de un álbum,
 * con el sello que dice cuál es más nueva.
 *
 * La entrada de la lista vive en su propio archivo porque es otro símbolo y
 * otro kind: acá estaban las dos —un `type` y una `interface` en un archivo
 * `*.interface.ts`—, así que el nombre del archivo describía a una sola y el
 * grep del `type` caía en un archivo que dice `interface`.
 */
export interface StoriesUpdatedPayload<TTimestamp = string> {
  albumId: string;
  stories: StoryBroadcastEntry<TTimestamp>[];
  /**
   * Sello monótono del emisor (ISO-8601), para descartar frames viejos.
   *
   * Dos `stories.updated` concurrentes —un create y un delete— pueden llegar
   * invertidos, y el cliente reemplaza la lista entera sin comparar recencia:
   * una historia borrada reaparece, o una recién publicada desaparece, hasta el
   * próximo refetch. No había NADA en el camino que ordenara los dos emits.
   */
  emittedAt: string;
}
