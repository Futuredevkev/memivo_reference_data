import type { StoreSubscriptionPeriod } from '../enums/store-subscription-period.enum';
/**
 * UNA opción de compra dentro de la app, tal como la tienda la conoce.
 *
 * ── POR QUÉ EL IDENTIFICADOR DE PRODUCTO LO MANDA EL SERVIDOR ─────────────
 * Podría estar horneado en el binario: la app se lo tiene que decir a la tienda
 * igual, así que «no le llega conocimiento del proveedor» ya es imposible acá.
 * Lo que decide dónde vive es OTRA cosa: **con qué frecuencia cambia y qué
 * cuesta cambiarlo.** Un identificador horneado se corrige publicando una
 * versión y esperando que la gente actualice; mandado por el servidor, se
 * corrige con un deploy. Y hay un caso concreto en el que eso importa: si un
 * producto se configura mal en la consola de la tienda y hay que reemplazarlo
 * por otro, el binario viejo seguiría pidiendo el que no existe — y una tienda
 * que no reconoce el producto no muestra un error útil, muestra nada.
 *
 * Es el mismo argumento —y la misma forma— que ya gobierna en qué regiones se
 * puede ofrecer la compra por web: la política vive en el servidor porque tiene
 * que poder cambiar sin pasar por una tienda.
 *
 * ── LO QUE ACÁ NO VIAJA, Y ES DELIBERADO ──────────────────────────────────
 * **Ningún precio.** Lo dice la tienda, en la moneda de quien mira y con su
 * formato local, y es la única que puede decirlo sin quedar vieja. **Ninguna
 * duración en días**: el ciclo real lo fija la tienda al cobrar, y un número
 * nuestro al lado sería una segunda copia de un hecho ajeno.
 *
 * ── NO ES AUTORIDAD ───────────────────────────────────────────────────────
 * Dice qué se puede OFRECER. Que la compra valga lo decide la tienda cuando el
 * servidor le pregunta por el comprobante, y el plan lo escribe el servidor
 * contra esa respuesta. Una lista adulterada del lado del cliente consigue que
 * la tienda rechace un producto que no existe.
 */
export interface StoreOffer {
    /** Cada cuánto se cobra. Sirve para rotular y ordenar, no para calcular. */
    readonly period: StoreSubscriptionPeriod;
    /**
     * El identificador que la tienda reconoce, tal cual, para pedírselo al SDK.
     *
     * La app lo usa como opaco: no lo parsea, no lo compone y no deriva nada de
     * él. Cómo se llama cada producto es una decisión de la consola de la tienda,
     * y el día que cambie, cambia acá.
     */
    readonly productId: string;
}
