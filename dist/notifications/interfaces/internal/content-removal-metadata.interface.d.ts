import type { ModeratedContentType } from '../../../album';
import type { AlbumNotificationMetadata } from '../album-notification-metadata.interface';
/**
 * Lo que necesita saber el aviso de «te retiraron una pieza»: de qué álbum y
 * qué clase de pieza era.
 *
 * Es UNA sola forma para las DOS autoridades que pueden retirar —el organizador
 * del álbum y Memivo—, y eso es deliberado: el dato es el mismo, y lo que
 * cambia entre las dos es la VOZ del texto, que vive en la plantilla de cada
 * tipo. Se llamaba `ContentRemovedByOrganizerMetadata`; el nombre nombraba a una
 * de las dos autoridades y habría empujado a copiar la interfaz para la otra,
 * que es la forma exacta de tener dos definiciones del mismo dato (ORDEN §1).
 */
export interface ContentRemovalMetadata extends AlbumNotificationMetadata {
    contentType: ModeratedContentType;
}
