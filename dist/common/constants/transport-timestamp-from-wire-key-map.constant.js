"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSPORT_TIMESTAMP_FROM_WIRE_KEY_MAP = void 0;
/**
 * QUÉ CLAVES VIAJAN EN SNAKE Y VUELVEN EN CAMEL. Éste es el único lugar donde se
 * agrega una.
 *
 * Lo leen el normalizador del cliente (renombra al entrar) y su espejo del api
 * (renombra al salir, con el mapa gemelo `TRANSPORT_TIMESTAMP_TO_WIRE_KEY_MAP`),
 * y de acá deriva `NormalizeTransportTimestamps` — que antes repetía los dos
 * literales a mano, así que agregar una clave acá cambiaba el runtime de los dos
 * lados y el TIPO no se enteraba.
 *
 * ── LO QUE ESTE MAPA DECIDE, Y NO SE VE EN NINGÚN NOMBRE DE CAMPO ─────────
 * Que una clave esté acá es lo que obliga al call-site del cliente a envolver su
 * tipo en `NormalizeTransportTimestamps<>`. No es «camel vs snake»: `StoryResponse`
 * declara `expiresAt` y `created_at` en la misma interfaz y funciona, porque sólo
 * la segunda está acá. Por eso los contratos declaran estas dos claves EN SNAKE
 * —la forma del cable— y una excepción hay que declararla en
 * `wire-timestamp-keys-are-snake.test.js` con su motivo.
 */
exports.TRANSPORT_TIMESTAMP_FROM_WIRE_KEY_MAP = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
};
