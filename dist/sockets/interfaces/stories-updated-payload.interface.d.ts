import type { StoryResponse } from '../../stories';
/**
 * Historia tal como viaja en un broadcast de álbum.
 *
 * `viewCount` y `viewedByMe` NO están, y esa ausencia es deliberada: son datos
 * PER-VIEWER y el broadcast es album-wide, así que el emisor no los puede
 * calcular. Antes viajaban con `0` y `false` fijos y el cliente los tapaba con
 * un merge contra su cache — lo que sólo funciona para historias que ya tenía:
 * una historia que llegaba por socket sin estar cacheada se pintaba con cero
 * vistas, y el contador es visible para cualquiera. El tipo mentía y el runtime
 * pagaba. Ahora el merge del cliente es el único dueño de esos dos campos, y el
 * compilador lo obliga.
 */
export type StoryBroadcastEntry<TTimestamp = string> = Omit<StoryResponse<TTimestamp>, 'viewCount' | 'viewedByMe'>;
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
