"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorePlatform = void 0;
/**
 * EN QUÉ TIENDA se hizo una compra dentro de la app.
 *
 * ── POR QUÉ ESTO SÍ CRUZA EL CABLE, Y `BillingProvider` NO ────────────────
 * El enum de proveedores del servidor es asunto del servidor: el cliente
 * pregunta qué plan tiene y recibe un tier, nunca el nombre de una pasarela.
 * Acá es al revés, y por una razón física: **el SDK de compras corre EN el
 * teléfono**, así que la app no puede no saber en qué tienda está parada — se
 * lo pregunta al sistema operativo antes de poder pedir un producto. Ocultarlo
 * no protegería nada; sólo obligaría a inferirlo del lado del servidor a partir
 * de la forma del token, que es la clase de detector que se degrada solo.
 *
 * ── LO QUE ESTE VALOR NO ES ───────────────────────────────────────────────
 * **No es autoridad.** Cuando viaja en una compra dice a QUÉ tienda hay que
 * preguntarle, no qué plan otorgar: el servidor le pregunta a esa tienda y la
 * respuesta de la tienda es lo único que mueve un derecho. Un cliente que
 * mintiera con este campo consigue que le pregunten a la tienda equivocada, y
 * la verificación falla — no consigue un plan.
 *
 * ── POR QUÉ ES UN ENUM Y NO DOS BOOLEANOS ─────────────────────────────────
 * Porque las tablas que dicen qué producto se ofrece en cada tienda son
 * `Record<StorePlatform, …>` TOTALES: una tienda nueva —una tercera, el día que
 * exista— no compila hasta que alguien conteste qué se le ofrece y cómo se
 * verifica lo que devuelve.
 */
var StorePlatform;
(function (StorePlatform) {
    /** App Store de Apple. Verifica por la firma del propio recibo. */
    StorePlatform["APP_STORE"] = "APP_STORE";
    /** Google Play. Verifica preguntándole a la API de la tienda. */
    StorePlatform["PLAY_STORE"] = "PLAY_STORE";
})(StorePlatform || (exports.StorePlatform = StorePlatform = {}));
