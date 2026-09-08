import type { PlanTier } from '../enums/plan-tier.enum';
import type { StorePlatform } from '../enums/store-platform.enum';
import type { StoreOffer } from './store-offer.interface';

/**
 * Lo que el servidor contesta cuando el cliente pregunta qué plan tiene.
 *
 * ── POR QUÉ VIAJA EL TIER Y NO LOS TOPES ───────────────────────────────────
 * Porque los topes ya viajan: `PLAN_LIMITS` es del contrato y los dos lados lo
 * leen del mismo pin. Mandarlos en la respuesta sería una segunda copia que se
 * desincroniza con el cliente viejo, y además haría que el cliente creyera que
 * el número es negociable por respuesta.
 *
 * ── POR QUÉ NO VIAJA `expiresAt` ───────────────────────────────────────────
 * Porque hoy no lo lee nadie, y un payload con campos que nadie lee es deuda
 * (ORDEN §7). El aviso de vencimiento es otra ola y tiene su propio canal —una
 * notificación—: cuando llegue, este campo entra con su consumidor.
 *
 * ── ESTO ES CACHÉ DE CONVENIENCIA, NUNCA AUTORIDAD ─────────────────────────
 * Sirve para que la pantalla dibuje rápido y para no hacerle perder el tiempo a
 * quien va a chocar un tope. NO autoriza: el servidor vuelve a resolver el plan
 * en cada operación que lo necesita, y ningún endpoint acepta el plan desde el
 * cliente.
 */
export interface EntitlementResponse {
  readonly tier: PlanTier;
  /**
   * Cuántos álbumes creó esta cuenta MIENTRAS NO TENÍA PLAN ACTIVO.
   *
   * Viaja porque el modelo lo exige con todas las letras: el contador se
   * MUESTRA antes de cualquier rechazo. Sin él, la única forma de enterarse del
   * cupo sería chocarlo — y en la pantalla de crear un álbum eso significa
   * perder lo que ya se escribió.
   *
   * No es un dato de autoridad: el servidor lo vuelve a leer, bajo lock, cada
   * vez que decide si se puede crear.
   */
  readonly albumsCreatedWhileFree: number;
  /**
   * EN QUÉ REGIONES se puede ofrecer la compra por web, en ISO 3166-1 alpha-2 y
   * en mayúsculas. Vacío significa: en ninguna, no la ofrezcas en ningún lado.
   *
   * ── POR QUÉ LA LISTA VIAJA Y NO UN `boolean` YA RESUELTO ────────────────
   * Porque el servidor no sabe en qué tienda está parado quien pregunta. La
   * regla que gobierna esto es de la tienda de aplicaciones —hay storefronts
   * donde enlazar a un cobro de afuera está permitido y otros donde no—, y esa
   * pertenencia la conoce el dispositivo, no una IP. Un `boolean` resuelto en
   * el servidor sería una respuesta sobre algo que el servidor no puede
   * observar.
   *
   * ── PERO LA POLÍTICA ES DEL SERVIDOR, Y ÉSE ES EL PUNTO ─────────────────
   * La lista se decide del lado del servidor a propósito: la regla que la funda
   * está judicialmente en movimiento y puede haber que apagar el canal de un
   * día para el otro. Con la lista horneada en el binario, apagarlo sería
   * publicar una versión y esperar que la gente actualice; con la lista en la
   * respuesta, es un deploy.
   *
   * ── ESTO NO ES AUTORIDAD, Y NO LA PARECE ────────────────────────────────
   * Decide si se DIBUJA un botón, nada más. No autoriza a cobrar ni a otorgar:
   * quien emite el intento de compra es el servidor, contra la sesión, y quien
   * escribe el plan es el aviso firmado del proveedor. Una lista adulterada en
   * el cliente sólo consigue que se le muestre un botón a alguien a quien no
   * correspondía mostrárselo — que es un problema de cumplimiento con la
   * tienda, no un agujero de cobro.
   *
   * ── FALLA HACIA EL LADO SEGURO ──────────────────────────────────────────
   * No es opcional y no admite `null`: cuando el canal no está configurado, el
   * servidor manda el array VACÍO. Un campo ausente obligaría a cada lector a
   * decidir qué hacer sin él, y la mitad de las veces esa decisión sale
   * «mostralo».
   */
  readonly webCheckoutRegions: readonly string[];
  /**
   * QUÉ SE PUEDE COMPRAR DENTRO DE LA APP, por tienda. Vacío = en esa tienda no
   * se ofrece nada.
   *
   * ── POR QUÉ VIAJA ACÁ Y NO POR UNA RUTA PROPIA ──────────────────────────
   * Es el mismo argumento que el de las regiones del cobro web, y el mismo
   * momento: la única pantalla que necesita saber qué se puede ofrecer ya hace
   * esta lectura para saber si hay algo que ofrecer. Una ruta aparte serían dos
   * viajes para pintar un botón, y dos lecturas del plan que podrían contestar
   * distinto si el derecho vence entre una y otra.
   *
   * ── POR QUÉ VIENEN LAS DOS TIENDAS Y NO SÓLO LA DE QUIEN PREGUNTA ───────
   * Porque el servidor no sabe en qué tienda está parado quien pregunta: lo
   * sabe el teléfono, y hoy no lo manda. Se podría hacer que lo mandara —sería
   * un dato de dispositivo, no una autoridad— pero eso cambia la firma de una
   * lectura que hacen tres pantallas para ahorrar dos cadenas de texto. Manda
   * las dos y que el cliente elija la suya: el payload es diminuto y la ruta no
   * cambia.
   *
   * ── `Record` TOTAL, Y ES LO QUE HACE QUE SIRVA ──────────────────────────
   * Una tienda nueva no compila hasta que alguien conteste qué se ofrece ahí.
   * Con un objeto parcial, la tercera tienda entraría en silencio ofreciendo
   * nada, que es exactamente la decisión que hay que tomar a conciencia.
   *
   * ── FALLA HACIA EL LADO SEGURO ─────────────────────────────────────────
   * Cuando la tienda no está configurada, el servidor manda el array VACÍO para
   * esa plataforma — nunca omite la clave. Sin producto no hay nada que
   * pedirle a la tienda, y un botón que abre un diálogo de compra vacío es peor
   * que no tener botón.
   *
   * ── NO ES AUTORIDAD ────────────────────────────────────────────────────
   * Decide qué se DIBUJA. Quien verifica una compra es el servidor contra la
   * tienda, y quien escribe el plan es esa verificación. Una lista adulterada
   * del lado del cliente consigue que la tienda rechace un producto inexistente.
   */
  readonly storeOffers: Readonly<Record<StorePlatform, readonly StoreOffer[]>>;
}
