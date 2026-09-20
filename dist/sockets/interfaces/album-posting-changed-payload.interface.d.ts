import type { AlbumPostingSchedule } from '../../album/interfaces/album-posting-schedule.type';
/**
 * Cambió quién puede publicar en el álbum, en vivo.
 *
 * ── POR QUÉ VIAJA EL HORARIO Y NO EL VEREDICTO ────────────────────────────
 * Porque el veredicto depende del INSTANTE en que se mira, y entre el commit y
 * la llegada del socket pasa tiempo. Mandando la forma, quien lo recibe sabe
 * qué quedó configurado; el veredicto —si se puede publicar AHORA, y cuándo
 * cambia— se lo sigue dando el servidor con la respuesta del álbum, que es
 * quien puede convertir zonas.
 *
 * ── LO QUE ESTE EVENTO NO ES ──────────────────────────────────────────────
 * No es una autorización. La app lo usa para re-dibujar el composer y el
 * prompt de historias, nada más; cada escritura la vuelve a decidir el
 * servidor. Que el horario sea público entre los miembros no revela nada: el
 * estado del álbum lo ven todos igual.
 */
export interface AlbumPostingChangedPayload {
    albumId: string;
    schedule: AlbumPostingSchedule<string>;
}
