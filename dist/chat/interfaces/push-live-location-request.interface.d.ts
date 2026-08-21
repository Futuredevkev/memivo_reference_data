/**
 * Una posición nueva de un compartir en vivo que ya está abierto.
 *
 * No lleva el plazo ni nada que pueda extenderlo, y eso es la mitad del diseño:
 * **el vencimiento se fija al abrir y no se toca nunca más**. Si este pedido
 * pudiera correr la fecha, un cliente que siguiera mandando posiciones
 * mantendría el canal abierto para siempre — que es exactamente la diferencia
 * que paga la persona que creía haber dejado de compartir.
 *
 * `albumId` viaja porque toda ruta de chat valida el acceso contra el álbum, y
 * ésta no es la excepción: quien empuja una posición tiene que seguir teniendo
 * acceso al grupo, no sólo haberlo tenido cuando abrió el compartir.
 */
export interface PushLiveLocationRequest {
    albumId: string;
    latitude: number;
    longitude: number;
}
