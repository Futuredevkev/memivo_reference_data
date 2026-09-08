/**
 * CADA CUÁNTO se cobra una suscripción de la tienda.
 *
 * ── POR QUÉ EL PERÍODO VIAJA Y EL PRECIO NO ───────────────────────────────
 * El precio lo dice la tienda, en la moneda y con el formato del país de quien
 * mira, y es la ÚNICA fuente que puede decirlo sin mentir: una copia nuestra
 * quedaría vieja el día que la tienda ajuste su tabla de equivalencias, y un
 * precio viejo publicado es una oferta reclamable. El período, en cambio, es
 * nuestro: es cómo decidimos empaquetar el plan, no cómo la tienda lo cobra.
 *
 * ── PARA QUÉ LO USA EL CLIENTE ────────────────────────────────────────────
 * Para dos cosas de DIBUJO: ordenar las opciones —el mensual primero, que es el
 * compromiso más chico— y rotularlas sin tener que leerle a la tienda su propia
 * descripción del ciclo, que llega con nombres distintos en cada plataforma.
 * Leerlo del SDK habría metido conocimiento de dos proveedores en la pantalla,
 * que es justo lo que el resto del cable evita.
 *
 * ── NO ES AUTORIDAD, Y NO ELIGE EL PRECIO ─────────────────────────────────
 * Quién cobra cuánto lo decide el identificador de producto que la tienda
 * reconoce. Este valor sólo rotula.
 */
export declare enum StoreSubscriptionPeriod {
    MONTHLY = "MONTHLY",
    ANNUAL = "ANNUAL"
}
