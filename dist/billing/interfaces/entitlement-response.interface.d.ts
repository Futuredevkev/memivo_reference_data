import type { PlanTier } from '../enums/plan-tier.enum';
import type { StorePlatform } from '../enums/store-platform.enum';
import type { SubscriptionManagementChannel } from '../enums/subscription-management-channel.enum';
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
 * ── `expiresAt` YA VIAJA, Y ENTRÓ CON SU CONSUMIDOR ────────────────────────
 * Acá decía por qué NO viajaba: «hoy no lo lee nadie, y un payload con campos
 * que nadie lee es deuda; cuando llegue, este campo entra con su consumidor».
 * Llegó el consumidor —la pantalla del plan, que es la única superficie donde
 * alguien puede ver hasta cuándo tiene lo que paga y desde dónde cancelarlo— y
 * el campo entró con él. Es la forma en la que este archivo quería que
 * entrara.
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
    /**
     * HASTA CUÁNDO vale el derecho vivo, en ISO 8601. `null` = no hay plan.
     *
     * ── POR QUÉ ES UN INSTANTE Y NO «CUÁNTOS DÍAS QUEDAN» ──────────────────
     * Porque los días los cuenta quien dibuja, con el reloj del teléfono, y una
     * cuenta hecha en el servidor envejece dentro de la propia caché: una
     * respuesta guardada cinco minutos diría «quedan 3 días» un rato después de
     * que quedaran 2. El instante no envejece.
     *
     * ── NO DICE SI RENUEVA ────────────────────────────────────────────────
     * Es la fecha hasta la que el derecho está pago, y nada más. Si la
     * suscripción se va a renovar sola lo sabe la tienda o la pasarela, no esta
     * fila: el modelo resuelve el plan contra el INSTANTE justamente para no
     * tener que mantener un espejo de ese estado. Quien lo dibuje no puede
     * prometer una renovación.
     *
     * ── NO ES AUTORIDAD ───────────────────────────────────────────────────
     * Sirve para decirlo en pantalla. Quien decide si alguien es Pro es el
     * servidor, en cada operación, contra su propia fila.
     */
    readonly expiresAt: string | null;
    /**
     * DÓNDE se gestiona y se cancela este plan.
     *
     * ── POR QUÉ VIAJA, Y NO ES COSMÉTICO ──────────────────────────────────
     * Sin esto la app no puede ofrecer cancelar, y una app con suscripción
     * auto-renovable que no dice cómo darse de baja es motivo conocido de rechazo
     * en la revisión de una tienda. O sea que este campo no mejora una pantalla:
     * habilita la publicación.
     *
     * ── EL DESTINO LO DECIDE EL SERVIDOR ──────────────────────────────────
     * El cliente no puede derivarlo: la suscripción pudo comprarse en una tienda
     * y estar viéndose desde la otra, o venir del cobro web, o ser una cortesía
     * asentada a mano. Quién cobró lo sabe la fila del otorgamiento, y el mapa de
     * proveedor a destino es un `Record` TOTAL del lado del servidor — así que un
     * proveedor nuevo no compila hasta que alguien diga dónde se cancela lo suyo.
     *
     * ── FALLA HACIA `NONE` ────────────────────────────────────────────────
     * No es opcional: sin plan, o con un plan que no tiene portal, el servidor
     * manda `NONE` y la pantalla lo dice en palabras en vez de ofrecer un botón
     * que no lleva a ningún lado.
     */
    readonly managementChannel: SubscriptionManagementChannel;
    /**
     * LA DIRECCIÓN a la que lleva ese botón. `null` = no hay botón.
     *
     * ── POR QUÉ VIAJA LA URL Y NO LA COMPONE LA APP ───────────────────────
     * Porque son direcciones de un TERCERO, y el conocimiento de un proveedor
     * externo no llega al cliente (ORDEN §4). Compuesta en la app, el día que una
     * tienda cambie su ruta hay que sacar un build por tienda y esperar la
     * revisión de cada una; mandada desde acá, es un despliegue.
     *
     * ── POR QUÉ ADEMÁS DEL CANAL, Y NO EN VEZ DE ──────────────────────────
     * Son dos preguntas: el canal elige las PALABRAS —«en la App Store», «en
     * Google Play», «desde la web»— y la dirección elige el DESTINO. Con la URL
     * sola la app tendría que adivinar el texto mirando el host, que es
     * exactamente la clase de decisión que se llavea por el eje equivocado.
     *
     * ── NO PUEDE SER `null` CON UN CANAL DISTINTO DE `NONE` ───────────────
     * El servidor los resuelve JUNTOS: un canal que se quedó sin dirección
     * —el portal web sin configurar— degrada a `NONE` antes de contestar. O sea
     * que la combinación «te digo dónde pero no a dónde» no existe, y la app no
     * necesita defenderse de ella.
     */
    readonly managementUrl: string | null;
}
