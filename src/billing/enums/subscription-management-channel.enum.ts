/**
 * DÓNDE se gestiona —y se cancela— una suscripción viva.
 *
 * ── ES EL DESTINO, NO EL PROVEEDOR ─────────────────────────────────────────
 * Se publica esto y no `BillingProvider` a propósito. El proveedor es un detalle
 * interno del cobro: dice quién le cobró a quién. Lo que el teléfono necesita
 * saber es OTRA cosa —a dónde mandar a la persona cuando toca «gestionar el
 * plan»—, y esas dos preguntas coinciden hoy por casualidad. El día que un
 * proveedor nuevo se gestione desde el mismo portal que otro, o que uno deje de
 * tener portal, el mapa cambia sin que el cliente se entere: es un `Record`
 * TOTAL del lado del servidor.
 *
 * Es el mismo criterio con el que `StorePlatform` cruza el cable y
 * `BillingProvider` no: cruza lo que el teléfono TIENE que poder actuar.
 *
 * ── `NONE` NO ES «NO SÉ»: ES «ACÁ NO SE CANCELA» ──────────────────────────
 * Cubre dos casos reales y los dos necesitan la misma pantalla: quien no tiene
 * plan, y quien lo tiene por una cortesía asentada a mano —que no pasó por
 * ninguna pasarela y por lo tanto no tiene portal donde darse de baja—. La
 * pantalla dice que hay que escribirle a alguien, que es la verdad, en vez de
 * ofrecer un botón que no lleva a ningún lado.
 *
 * Y es el DEFAULT del lado seguro: cuando el cliente no sabe —respuesta vieja,
 * campo ausente— no ofrece nada. Ofrecer de más acá es mandar a alguien a una
 * pantalla de la tienda donde no va a encontrar su suscripción.
 */
export enum SubscriptionManagementChannel {
  NONE = 'NONE',
  APP_STORE = 'APP_STORE',
  PLAY_STORE = 'PLAY_STORE',
  WEB = 'WEB',
}
