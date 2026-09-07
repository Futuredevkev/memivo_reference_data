/**
 * Lo que el servidor contesta cuando la app pide empezar una compra web.
 *
 * ── POR QUÉ VIAJA UNA URL ARMADA Y NO EL TOKEN ────────────────────────────
 * El token de un solo uso es la mitad de una URL de un proveedor externo, y el
 * cliente no puede conocer la otra mitad: ni el host, ni el nombre del
 * parámetro que la lleva, ni el identificador del producto. Si viajara el token
 * pelado, el cliente tendría que componer la URL — y con eso el nombre del
 * proveedor, su forma de query y su producto quedarían horneados en un binario
 * que sólo se cambia publicando una versión. Cambiar de proveedor dejaría de
 * ser una tabla y pasaría a ser una ola con build de tienda.
 *
 * Con la URL armada, el cliente hace una sola cosa —abrirla— y no sabe con
 * quién está hablando. Es la misma regla con la que el servidor normaliza las
 * respuestas de su proveedor de imágenes antes de mandarlas.
 *
 * ── POR QUÉ NO VIAJA `expiresAt` ──────────────────────────────────────────
 * Porque nadie lo leería: la app abre el navegador en el acto y no dibuja
 * ninguna cuenta regresiva. Un campo que nadie lee es deuda, y es exactamente
 * lo que el hermano `EntitlementResponse` ya declaró sobre el mismo nombre.
 * El vencimiento existe y lo aplica el servidor cuando el token se consume; la
 * app no tiene nada que decidir con él.
 *
 * ── Y POR QUÉ NO VIAJA NADA DEL PRECIO ────────────────────────────────────
 * El precio es del checkout hospedado, que es quien cobra y quien lo muestra.
 * Mandarlo acá lo convertiría en una copia más, y una copia de un precio es una
 * oferta que puede quedar vieja.
 */
export interface CheckoutIntentResponse {
    /**
     * La URL que la app abre en el navegador del sistema, tal cual, sin
     * concatenarle nada.
     *
     * Lleva adentro un identificador de un solo uso que es lo único que le
     * permite al servidor saber, cuando llegue el aviso de pago, a quién
     * acreditarle el plan. Por eso no se comparte, no se loguea y no se guarda:
     * quien la tenga puede hacer que un pago ajeno caiga en esta cuenta.
     */
    readonly checkoutUrl: string;
}
