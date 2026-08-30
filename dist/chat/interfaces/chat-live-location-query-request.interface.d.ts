/**
 * El álbum contra el que se autoriza una operación del canal de ubicación en
 * vivo, cuando viaja como query string.
 *
 * Existe por lo mismo que su hermana `GetActivePollQueryRequest`: toda ruta de
 * chat valida el acceso contra el álbum, y un `{ albumId }` escrito a mano en
 * el `params` de axios es un contrato que sólo vive en el call-site — el
 * auditor de transporte del paquete lo persigue justamente porque ahí es donde
 * las dos puntas se desincronizan sin que nada falle.
 */
export interface ChatLiveLocationQueryRequest {
    albumId: string;
}
