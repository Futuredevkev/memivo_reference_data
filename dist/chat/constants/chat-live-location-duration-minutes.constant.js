"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_LIVE_LOCATION_DURATION_MINUTES = void 0;
const enums_1 = require("../enums");
/**
 * Cuántos minutos dura cada plazo. `Record` TOTAL sobre
 * `ChatLiveLocationDuration`: un plazo nuevo no compila hasta que alguien diga
 * cuánto vale.
 *
 * Vive del lado del contrato porque los dos repos necesitan el MISMO número y
 * por motivos distintos: el servidor lo convierte en el vencimiento que hace
 * cumplir —y en el TTL de la clave de Redis—, y la app lo usa para escribir la
 * etiqueta del menú. Escrito dos veces, un cambio de plazo dejaría a la app
 * ofreciendo «1 hora» sobre un compartir que el servidor corta a los 45
 * minutos, y nada se pondría rojo.
 */
exports.CHAT_LIVE_LOCATION_DURATION_MINUTES = {
    [enums_1.ChatLiveLocationDuration.FIFTEEN_MINUTES]: 15,
    [enums_1.ChatLiveLocationDuration.ONE_HOUR]: 60,
    [enums_1.ChatLiveLocationDuration.EIGHT_HOURS]: 8 * 60,
};
