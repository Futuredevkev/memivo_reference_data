/**
 * Cuánto puede durar un compartir de ubicación EN VIVO.
 *
 * ── POR QUÉ UN CONJUNTO CERRADO Y NO UNA CANTIDAD DE MINUTOS ───────────────
 * Porque el plazo es el único freno que tiene esta función, y un número que
 * viaja en el body es un freno que el cliente elige: quien arme la request a
 * mano pide un millón de minutos y queda transmitiendo su posición —o peor, la
 * de otro— por meses. Con un enum, el servidor no tiene que validar un rango:
 * el DTO rechaza cualquier cosa que no sea uno de estos tres, y el `Record` de
 * minutos traduce. La app tampoco puede ofrecer un cuarto plazo sin que este
 * archivo lo declare.
 *
 * ── LOS TRES PLAZOS, Y POR QUÉ SON ÉSTOS ───────────────────────────────────
 * Decisión del dueño del 15 de agosto: cubren «estoy llegando», «nos
 * encontramos» y «avisame cuando llegues».
 *
 * ⚠️ **No existe «hasta que lo cortes», y es a propósito**: alcanza con
 * olvidarse una vez para quedar transmitiendo la posición por días. Cortar
 * antes sí se puede, y es inmediato.
 */
export declare enum ChatLiveLocationDuration {
    FIFTEEN_MINUTES = "FIFTEEN_MINUTES",
    ONE_HOUR = "ONE_HOUR",
    EIGHT_HOURS = "EIGHT_HOURS"
}
